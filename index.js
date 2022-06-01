scanButton.addEventListener("click", async () => {
  log("User clicked scan button");

  try {
    const ndef = new NDEFReader();
    await ndef.scan();
    log("> Scan started");

    ndef.addEventListener("readingerror", () => {
      log("Argh! Cannot read data from the NFC tag. Try another one?");
    });

    ndef.addEventListener("reading", ({ message, serialNumber }) => {
      log(`> Serial Number: ${serialNumber}`);
      log(`> Records: (${message.records.length})`);
      log(`> Text: (${message.records[0]})`)
    });
  } catch (error) {
    log("Argh! " + error);
  }
});


function readTextRecord(record) {
  console.assert(record.recordType === "text");
  const textDecoder = new TextDecoder(record.encoding);
  console.log(`Text: ${textDecoder.decode(record.data)} (${record.lang})`);
}

writeButton.addEventListener("click", async () => {
  log("User clicked write button");

  function a2utf16(string) {
    let result = new Uint16Array(string.length);
    for (let i = 0; i < string.length; i++) {
      result[i] = string.codePointAt(i);
    }
    return result;
  }
  
  const textRecord = {
    recordType: "text",
    lang: "en",
    encoding: "utf-16",
    data: a2utf16("{'name':'Arif', 'token':'12345', 'expiry':'20220605', 'access-level':'assaabloy'}")
  };
  const ndef = new NDEFReader();
await ndef.scan();
ndef.onreading = async (event) => {
  const decoder = new TextDecoder();
  for (const record of event.message.records) {
    log("Record type:  " + record.recordType);
    log("MIME type:    " + record.mediaType);
    log("=== data ===\n" + decoder.decode(record.data));
  }

  try {
    await ndef.write({ records: [textRecord] });
  } catch(error) {
    console.log(`Write failed :-( try again: ${error}.`);
  }
};
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