<!DOCTYPE HTML>
<html lang="en">
<cfsetting showdebugoutput="false" />
    <head>

        <title>Bouncing Ball with throw physics</title>
		  <!-- Mobile viewport optimized: j.mp/bplateviewport -->
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

			color = randomColor();

		</script>

    </head>

    <body>
		<cfif server.coldfusion.productversion contains "10">
		<cfinclude template="_includes/cf10socket.cfm" />
		</cfif>
        <div id="page" >
            <canvas id="canvas" width="600" height="600" style="height:600px;z-index: 10;background: #2391e8">
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
			
			<canvas id="output" style="z-index: 1;display:none"></canvas>
			
			<div id="messages_container" style="display:none">
				<ul id="messages"></ul>
			</div>
			
			<div id="target_0" class="target" style="height:100px;width:100px;display:none"></div>
			
           

        </div>
		<div>
		 <p>
                Click anywhere on the canvas and 'throw' the ball by moving the mouse and releasing the button.
				<button type="button" onClick="reset()">Reset</button>
            </p>
		</div>
    </body>
</html>