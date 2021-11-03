// weirdly enough, our webpack config doesn't transform optional chaining of
// pdf.js and we need to use legacy or eject
// see mozilla/pdf.js#14080
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import PDFJSWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";
import { useEffect } from "react";

import "./App.css";

// weird, but errors without it. Seee mozilla/pdfjs#11990
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

async function makeThumb(page) {
  const vp = page.getViewport({ scale: 1 });
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 400;
  const scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
  // takes 1-2 seconds
  await page.render({
    canvasContext: canvas.getContext("2d"),
    viewport: page.getViewport({ scale }),
  }).promise;

  return canvas;
}

const getDoc = (
  url = "https://upload.wikimedia.org/wikipedia/commons/d/d3/Test.pdf"
) => pdfjsLib.getDocument(url).promise;

const parseDoc = async (doc) => {
  // list of pages starting with 1
  const pages = [1, 2, 3, 4, 5];
  pages.forEach(async (num) => {
    // create a div for each page and build a small canvas for it
    const div = document.createElement("div");
    document.body.appendChild(div);
    const page = await doc.getPage(num);
    const thumb = await makeThumb(page);
    div.appendChild(thumb);
  });
};

const App = () => {
  useEffect(() => {
    getDoc().then(parseDoc);
  }, []);

  return <div className="App"></div>;
};

export default App;
