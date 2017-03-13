<!DOCTYPE HTML>
<html lang="en">
<cfsetting showdebugoutput="false" />
<head>
	<link rel="stylesheet" href="style.css">
<script type="text/javascript" src="ccv.js"></script>
<script type="text/javascript" src="face.js"></script>

  <title>WebRTC Face Reco Demo Application</title>

</head>

<body>
	<cfoutput>
	<script type="text/javascript" src="face_canvas.js?#now()#"></script>
</cfoutput>
<canvas id="output"></canvas>
<div id="messages_container">
	<ul id="messages"></ul>
</div>
<div id="ball" class="ball">&nbsp;</div>
</body>

</html>

