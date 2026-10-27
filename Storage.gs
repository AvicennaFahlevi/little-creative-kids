// Advanced Drive service v3 with drive.file scope: only app-created files.
function getCloudStorageStatus() {
  return {enabled: PropertiesService.getUserProperties().getProperty('cloudEnabled') === 'true'};
}

function setCloudStorageEnabled(enabled) {
  requireUser_();
  if (typeof enabled !== 'boolean') throw new Error('Invalid preference');
  PropertiesService.getUserProperties().setProperty('cloudEnabled', String(enabled));
  return {enabled: enabled};
}

function appFolder_() {
  var props = PropertiesService.getUserProperties();
  var id = props.getProperty('artworkFolder');
  if (id) {
    try {
      var folder = Drive.Files.get(id, {fields: 'id,mimeType,trashed'});
      if (folder.mimeType === 'application/vnd.google-apps.folder' && !folder.trashed) return id;
    } catch (e) { /* Recreate only the app's own missing folder. */ }
  }
  var created = Drive.Files.create({name:LCK_CONFIG.folderName,mimeType:'application/vnd.google-apps.folder'}, null, {fields:'id'});
  props.setProperty('artworkFolder', created.id);
  return created.id;
}

function validatePng_(dataUrl) {
  if (typeof dataUrl !== 'string' || dataUrl.length > Math.ceil(LCK_CONFIG.maxPngBytes * 4 / 3) + 30 || !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(dataUrl)) throw new Error('Invalid PNG payload');
  var bytes = Utilities.base64Decode(dataUrl.split(',')[1]);
  if (bytes.length < 33 || bytes.length > LCK_CONFIG.maxPngBytes) throw new Error('Invalid PNG size');
  var sig = [137,80,78,71,13,10,26,10];
  for (var i=0;i<sig.length;i++) if ((bytes[i]&255)!==sig[i]) throw new Error('Invalid PNG signature');
  if (String.fromCharCode.apply(null, bytes.slice(12,16)) !== 'IHDR') throw new Error('Missing PNG header');
  function uint(offset) { return (bytes[offset]&255)*16777216+(bytes[offset+1]&255)*65536+(bytes[offset+2]&255)*256+(bytes[offset+3]&255); }
  var width=uint(16),height=uint(20);
  if (!width || !height || width>4096 || height>4096 || width*height>9000000) throw new Error('PNG dimensions too large');
  // Check bounded chunks and their CRCs. Apps Script has no native PNG decoder.
  var offset=8,hasData=false,ended=false;
  while(offset<bytes.length){
    if(offset+12>bytes.length) throw new Error('Truncated PNG chunk');
    var length=uint(offset),end=offset+12+length;
    if(end>bytes.length) throw new Error('Invalid PNG chunk size');
    var type=String.fromCharCode.apply(null,bytes.slice(offset+4,offset+8));
    if(offset===8 && (type!=='IHDR'||length!==13)) throw new Error('Invalid PNG header');
    var crc=0xffffffff;
    for(var j=offset+4;j<end-4;j++){
      crc^=bytes[j]&255;
      for(var bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);
    }
    if(((crc^0xffffffff)>>>0)!==uint(end-4)) throw new Error('PNG checksum failed');
    if(type==='IDAT'&&length)hasData=true;
    if(type==='IEND'){if(length!==0||end!==bytes.length) throw new Error('Invalid PNG end');ended=true;}
    offset=end;
  }
  if(!hasData||!ended) throw new Error('Incomplete PNG');
  return Utilities.newBlob(bytes,'image/png');
}

function saveArtworkToDrive(dataUrl) {
  requireUser_();
  if (!getCloudStorageStatus().enabled) throw new Error('Enable cloud storage in Parent Mode first');
  var blob=validatePng_(dataUrl);
  var lock=LockService.getUserLock();lock.waitLock(10000);
  try {
    var props=PropertiesService.getUserProperties(),now=Date.now();
    if(now-Number(props.getProperty('lastUpload')||0)<3000) throw new Error('Please wait before saving again');
    var name='karya-'+new Date(now).toISOString().replace(/[:.]/g,'-')+'-'+Utilities.getUuid()+'.png';
    var file=Drive.Files.create({name:name,mimeType:'image/png',parents:[appFolder_()]},blob,{fields:'id'});
    props.setProperty('lastUpload',String(now));
    return {saved:true,id:file.id};
  } finally {lock.releaseLock();}
}
