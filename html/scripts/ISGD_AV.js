
 webiopi().ready(init);
 serialusb0 = new Serial("usb0");
 serialusb1 = new Serial("usb1");


 function init () {

 				var updateLightHours = function(macro, args, response) {
							var hours = response.split(";");
							// Following lines use jQuery functions
							$("#inputOn").val(hours[0]);
							$("#inputOff").val(hours[1]);
				}

				//Configure Port Direction
				    webiopi().setFunction(17,"out");
        		webiopi().setFunction(18,"out");
        		webiopi().setFunction(22,"out");
        		webiopi().setFunction(23,"out");

				//Create Handlers
        		var content, button;
        		content = $("#content");
/*
				//Create buttons
        		button = webiopi().createGPIOButton(17,"Prayer Hall");
        		content.append(button);

        		button = webiopi().createGPIOButton(18,"Admin");
        		content.append(button);

        		button = webiopi().createGPIOButton(22,"Nursery");
        		content.append(button);

        		button = webiopi().createGPIOButton(23,"GYMNASIUM");
        		content.append(button);

				//Create edit boxes to show on/off
				webiopi().callMacro("getLightHours", [], updateLightHours);

				button = webiopi().createButton("sendButton", "Send", function() {
							var hours = [$("#inputOn").val(), $("#inputOff").val()];
							webiopi().callMacro("setLightHours", hours, updateLightHours);
						});
				content.append(button);
*/				// Refresh GPIO buttons
				// pass true to refresh repeatedly of false to refresh once
				webiopi().refreshGPIO(true);
				};
