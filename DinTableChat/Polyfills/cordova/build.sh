cordova build android --release 
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android.keystore ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk android-dtc-key
zipalign -v 4 ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk app-release-beta.apk
rm ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
