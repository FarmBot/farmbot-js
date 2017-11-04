var FB = require("./dist/farmbot");
global.atob = require("atob");

var f = new FB.Farmbot({
  token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodW1hbiIsInN1YiI6MjI2MSwiaWF0IjoxNTA5NzY4OTgxLCJqdGkiOiJmYmQ2M2JhYy1iODk2LTQ1YmMtOGRkOS0wNDczNTM4NTc1NzQiLCJpc3MiOiIvL215LmZhcm1ib3QuaW86NDQzIiwiZXhwIjoxNTEzMjI0NTA0LCJtcXR0IjoiYnJpc2stYmVhci5ybXEuY2xvdWRhbXFwLmNvbSIsIm1xdHRfd3MiOiJ3c3M6Ly9icmlzay1iZWFyLnJtcS5jbG91ZGFtcXAuY29tOjQ0My93cy9tcXR0Iiwib3NfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvZmFybWJvdC9mYXJtYm90X29zL3JlbGVhc2VzL2xhdGVzdCIsImZ3X3VwZGF0ZV9zZXJ2ZXIiOiJERVBSRUNBVEVEIiwiYm90IjoiZGV2aWNlXzIyNTgifQ.d-p7URuKDA6_KJxswLCMlIFDxA9ASf8V7fg_7jEcUrbHJadJwIjgEGdoVhbRuLKtODsO0Lj2zcFlQXRo2mY5gpZ1axMRp_iYyHbwxMtbP071csKBU-FadhBppP3orpgVVV2xqyZ7U6ZqwBBl93qQR7ALG3yVjhO94EP2csswdJGjOj725g7nCQc8LnmeVkpkRt5vGRUebS0g6U7BymHXcYNtrR_hbEERJXToy4YTBL2axNyBdwkPNtb_79ULo2EbPTnmnA9oF0uiA-LqSlFvdyzhE2wpBpSX89pK8M177wezzYCOEu-52Bfucj8gOuqqkmSqEuC0Z2eLDtIAR0h3Xg"
});

f.connect().then(() => console.log("OK"), (e) => (console.dir(e)));

f.on("*", (x) => {
  console.log(x);
});

f.on("online", () => {
  console.log("ONLINE");
});
f.on("offline", () => {
  console.log("offline");
});
