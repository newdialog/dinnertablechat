const SIGNATURE_ENDPOINT = 'https://mixzoom.herokuapp.com/make';


export async function zoomConnect(meeting:string) {
	return await fetch(`${SIGNATURE_ENDPOINT}/${meeting}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ meeting: meeting, redirect: window.location.href }),
		})
		.then(result => result.json())
		.then(result => result.murl)
		.then(start_url => {
			return start_url;
		})
}