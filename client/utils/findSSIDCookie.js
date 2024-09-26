const findSSIDCookie = (cookies) => {
  let cookieArray = cookies.split("; ")

  let ssid = ""
  for (let i = 0; i < cookieArray.length; i++) {
    if (cookieArray[i].includes("ssid=")) ssid = cookieArray[i].trim()
  }
  // Capture the value of the ssid cookie
  let ssidCookie = ssid.split("=")[1]

  return ssidCookie
}

export default findSSIDCookie
