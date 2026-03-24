const API = "https://YOUR-RENDER-URL.onrender.com";
const socket = io(API);

let chunks = [];
let total = 0;
let received = 0;

async function sendFile() {
  const file = document.getElementById("fileInput").files[0];

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(API + "/upload", {
    method: "POST",
    body: form
  });

  const data = await res.json();
  document.getElementById("code").innerText = "Code: " + data.code;
}

function receiveFile() {
  const code = document.getElementById("codeInput").value;

  chunks = [];
  received = 0;

  socket.emit("request-file", code);
}

socket.on("file-meta", (meta) => {
  total = meta.size;
});

socket.on("file-data", (chunk) => {
  chunks.push(chunk);
  received += chunk.byteLength;

  document.getElementById("progress").style.width =
    (received / total) * 100 + "%";
});

socket.on("file-end", () => {
  const blob = new Blob(chunks);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "fastdrop-file";
  a.click();
});