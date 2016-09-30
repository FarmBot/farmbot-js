import { Farmbot } from "./src/farmbot";

var SUPER_SECRET_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0ZXN0MTIzQHRlc3QuY29tIiwiaWF0IjoxNDU5MTA5NzI4LCJqdGkiOiI5MjJhNWEwZC0wYjNhLTQ3NjctOTMxOC0xZTQxYWU2MDAzNTIiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvIiwiZXhwIjoxNDU5NDU1MzI4LCJtcXR0IjoibG9jYWxob3N0IiwiYm90IjoiYWE3YmIzN2YtNWJhMy00NjU0LWIyZTQtNThlZDU3NDY1MDhjIn0.KpkNGR9YH68AF3iHP48GormqXzspBJrDGm23aMFGyL_eRIN8iKzy4gw733SaJgFjmebJOqZkz3cly9P5ZpCKwlaxAyn9RvfjQgFcUK0mywWAAvKp5lHfOFLhBBGICTW1r4HcZBgY1zTzVBw4BqS4zM7Y0BAAsflYRdl4dDRG_236p9ETCj0MSYxFagfLLLq0W63943jSJtNwv_nzfqi3TTi0xASB14k5vYMzUDXrC-Z2iBdgmwAYUZUVTi2HsfzkIkRcTZGE7l-rF6lvYKIiKpYx23x_d7xGjnQb8hqbDmLDRXZJnSBY3zGY7oEURxncGBMUp4F_Yaf3ftg4Ry7CiA";

let bot = new Farmbot({ token: SUPER_SECRET_TOKEN });
bot
  .connect()
  .then(function(bot) {
      return bot.moveRelative({x: 1, y: 2, z: 3, speed: 100});
  });
