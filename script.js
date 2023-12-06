document.addEventListener( 'DOMContentLoaded', function () {
	const webcamElement = document.getElementById( 'webcam' );
	const cameraSelect = document.getElementById( 'cameraSelect' );
	let currentStream;

	// Get available cameras
	function getCameras() {
		navigator.mediaDevices.enumerateDevices()
		         .then( devices => {
			         const videoDevices = devices.filter( device => device.kind === 'videoinput' );
			         cameraSelect.innerHTML = videoDevices.map( device => `<option value="${device.deviceId}">${device.label}</option>` ).join( '' );
		         } );
	}

	// Start the webcam feed
	function startWebcam( deviceId ) {
		if ( currentStream ) {
			currentStream.getTracks().forEach( track => track.stop() );
		}

		const constraints = {
			video: {deviceId: deviceId ? {exact: deviceId} : undefined}
		};

		navigator.mediaDevices.getUserMedia( constraints )
		         .then( stream => {
			         currentStream = stream;
			         webcamElement.srcObject = stream;
			         updateMetadata();
			         getCameras();
		         } )
		         .catch( error => console.error( 'Error accessing webcam:', error ) );
	}

	// Update metadata display
	function updateMetadata() {
		const track = currentStream.getVideoTracks()[0];
		const settings = track.getSettings();
		document.getElementById( 'metadata' ).innerHTML = `Resolution: ${settings.width}x${settings.height}, Frame rate: ${settings.frameRate}`;
	}

	// Event listeners
	document.getElementById( 'flipHorizontal' ).addEventListener( 'click', () => {
		webcamElement.classList.toggle( 'flip-horizontal' );
	} );

	document.getElementById( 'flipVertical' ).addEventListener( 'click', () => {
		webcamElement.classList.toggle( 'flip-vertical' );
	} );

	// Modified event listener for viewport-based full screen
	document.getElementById( 'fullscreen' ).addEventListener( 'click', () => {
		document.body.classList.toggle( 'fullscreen-enabled' );
		const isFullscreen = document.body.classList.contains( 'fullscreen-enabled' );
		document.getElementById( 'fullscreen' ).innerHTML = isFullscreen ?
			'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"/></svg>'
			:
			'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"/></svg>';
	} );

	cameraSelect.addEventListener( 'change', () => {
		startWebcam( cameraSelect.value );
	} );

	getCameras();
	startWebcam();
} );
let timeout;
document.body.addEventListener( 'mousemove', () => {
	clearTimeout( timeout );
	document.body.style.cursor = 'auto'; // Show cursor
	document.querySelector( '.button-container' ).style.display = 'block'; // Show buttons

	timeout = setTimeout( () => {
		if ( document.body.classList.contains( 'fullscreen-enabled' ) ) {
			document.body.style.cursor = 'none'; // Hide cursor
			document.querySelector( '.button-container' ).style.display = 'none'; // Hide buttons
		}
	}, 3000 ); // 3 seconds
} );
