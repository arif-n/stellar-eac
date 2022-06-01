function a2utf16(string) {
  let result = new Uint16Array(string.length);
  for (let i = 0; i < string.length; i++) {
    result[i] = string.codePointAt(i);
  }
  return result;
}

writeButton.addEventListener("click", async () => {
  log("User clicked write button");

  try {
    const ndef = new NDEFWriter();
    const textRecord = {
      recordType: "text",
      lang: "en",
      encoding: "utf-16",
      data: a2utf16("{'token':'12345', 'expiry':'20220605'}")
    };
    ndef.write({ records: [textRecord] });
    log("> Message written");
  } catch (error) {
    log("Argh! " + error);
  }
});

makeReadOnlyButton.addEventListener("click", async () => {
  log("User clicked make read-only button");

  try {
    const ndef = new NDEFReader();
    await ndef.makeReadOnly();
    log("> NFC tag has been made permanently read-only");
  } catch (error) {
    log("Argh! " + error);
  }
});
