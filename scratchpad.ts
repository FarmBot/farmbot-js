import { Farmbot } from "./src/farmbot";
let bot = new Farmbot({ token: "test123" });
bot
  .home({ axis: "x", speed: 800 })
  .then(function (ack) {
    console.log("X Axis is now at 0.");
  })
  .catch(function (err) {
    console.log("Failed to bring X axis home.");
  })
