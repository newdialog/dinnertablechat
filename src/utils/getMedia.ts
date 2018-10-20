export default async function getMedia(
  options: any = { video: false, audio: true },
  timeoutMs: number = 35000
): Promise<MediaStream> {
  return new Promise<MediaStream>((resolve, reject) => {
    // Timeout system
    const timeoutId = setTimeout(() => {
      reject('mic_timeout');
    }, timeoutMs);
    // Try newer browser getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices
        .getUserMedia(options)
        .then(x => {
          clearTimeout(timeoutId);
          resolve(x);
        })
        .catch(reject);
    } else {
      // Fallback to folder method of getUserMedia
      navigator.getUserMedia(
        options,
        x => {
          clearTimeout(timeoutId);
          resolve(x);
        },
        reject
      );
    }
  });
}
