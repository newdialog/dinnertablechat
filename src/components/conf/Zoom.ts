const SIGNATURE_ENDPOINT = 'https://mixzoom.herokuapp.com/make';


export async function zoomConnect(meeting:string) {
	return await fetch(`${SIGNATURE_ENDPOINT}/${meeting}`, {
			method: 'POST',
			body: JSON.stringify({ meeting: meeting })
		})
		.then(result => result.json())
		.then(result => result.start_url)
		.then(start_url => {
			return start_url;
		})
}