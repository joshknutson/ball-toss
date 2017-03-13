<!DOCTYPE HTML>
<html lang="en">
<cfsetting showdebugoutput="false" />
    <head>

        <title>Bouncing Ball with throw physics</title>
 		 <meta name="viewport" content="width=device-width,initial-scale=1">
		<link rel="stylesheet" href="style.css">
        <script src="excanvas.js"></script>

		<script type="text/javascript" src="ccv.js"></script>
		<script type="text/javascript" src="face.js"></script>
		<cfoutput>
			<script src="throw.js?#now()#"></script>
			<script type="text/javascript" src="face_canvas.js?#now()#"></script>
		</cfoutput>

		<script>
			ball.color = randomColor();

			function randomColor(){
				return "#"+Math.floor(Math.random()*16777216).toString(16);
			}
			<cfoutput>
			myid = '#createuuid()#';
			</cfoutput>
			ball.id = myid;

			color = randomColor();

		</script>

    </head>

    <body class="receiver">
		<cfif server.coldfusion.productversion contains "10">
		<cfinclude template="_includes/cf10socket.cfm" />
		</cfif>
        <div id="page" >
            <canvas id="canvas" width="600" height="600" style="height:600px;z-index: 10;">
                <p>
                    Unfortunately your browser is not able to run this content.
                </p>

                <p>
                    Please upgrade to the latest versions of Firefox, Safari, Chrome
                </p>

                <p>
                    or Opera.
                </p>

            </canvas>

			<canvas id="output" style="z-index: 1;"></canvas>

			<div id="messages_container">
				<ul id="messages"></ul>
			</div>

			<div id="target_0" class="target" style="height:100px;width:100px;"></div>

        </div>

    </body>
</html>