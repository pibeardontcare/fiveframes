import { CameraView, useCameraPermissions } from 'expo-camera';
import { Directory, File, Paths } from 'expo-file-system';

const FRAME_DIRECTORY = new Directory(Paths.document, 'photos');


// makes the photo directory if it does not already exist 
function ensurePhotoDir() {
  if (!FRAME_DIRECTORY.exists) FRAME_DIRECTORY.create({ intermediates: true });
}

//photo capture and time stamp 
export async function capturePhoto(cameraRef) {
  const photo = await cameraRef.current.takePictureAsync();
  ensurePhotoDir();
  const sourceFile = new File(photo.uri);
  const destFile = new File(FRAME_DIRECTORY, `entry-${Date.now()}.jpg`);
  sourceFile.copy(destFile);
  return destFile.uri;
}

export { CameraView, useCameraPermissions };