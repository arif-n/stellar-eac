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
    });
  } catch (error) {
    log("Argh! " + error);
  }
});

function a2utf16(string) {
  let result = new Uint16Array(string.length);
  for (let i = 0; i < string.length; i++) {
    result[i] = string.codePointAt(i);
  }
  return result;
}

writeButton.addEventListener("click", async () => {
  log("User clicked write button");
const ndef = new NDEFReader();
let ignoreRead = false;

ndef.onreading = (event) => {
  if (ignoreRead) {
    return; // write pending, ignore read.
  }

  console.log("We read a tag, but not during pending write!");
};

function write(data) {
  ignoreRead = true;
  return new Promise((resolve, reject) => {
    ndef.addEventListener("reading", event => {
      // Check if we want to write to this tag, or reject.
      ndef.write(data).then(resolve, reject).finally(() => ignoreRead = false);
    }, { once: true });
  });
}

ndef.scan();
try {
  const textRecord = {
    recordType: "text",
    lang: "en",
    encoding: "utf-16",
    data: a2utf16("{'token':'12345', 'expiry':'20220605'}")
  };
  ndef.write({ records: [textRecord] });
  console.log("We wrote to a tag!")
} catch(err) {
  console.error("Something went wrong", err);
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
