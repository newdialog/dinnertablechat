// import { ZoomMtg } from '@zoomus/websdk';

// ZoomMtg.setZoomJSLib('https://dmogdx0jrul3u.cloudfront.net/1.7.2/lib', '/av');
// ZoomMtg.setZoomJSLib('https://source.zoom.us/1.7.2/lib', '/av');


const SIGNATURE_ENDPOINT = 'https://mixzoom.herokuapp.com/';

let ZoomMtg: any;

export function makeConfig(meeting:any) {
	// ZoomMtg = document.getElementById("zmmtg-root") as any;
	ZoomMtg.preLoadWasm();
	ZoomMtg.prepareJssdk();
	
    const meetConfig = {
        // apiKey: '3239845720934223459',
        meetingNumber: meeting || '123456789',
        leaveUrl: 'https://mixopinions.com',
        // userName: 'Firstname Lastname',
        // userEmail: 'firstname.lastname@yoursite.com',
        // passWord: 'password',
        role: 0
    };
    return meetConfig
}

export function zoomConnect(meetConfig:any) {
	fetch(`${SIGNATURE_ENDPOINT}`, {
			method: 'POST',
			body: JSON.stringify({ meetingData: meetConfig })
		})
		.then(result => result.text())
		.then(response => {
			ZoomMtg.init({
				leaveUrl: meetConfig.leaveUrl,
				isSupportAV: true,
				success: function() {
					ZoomMtg.join({
						signature: response,
						apiKey: meetConfig.apiKey,
						meetingNumber: meetConfig.meetingNumber,
						/// userName: meetConfig.userName,
						// Email required for Webinars
						// userEmail: meetConfig.userEmail, 
						// password optional; set by Host
						// password: meetConfig.password,
						error(res) { 
							console.log(res) 
						}
					})		
				}
			})
	})
}