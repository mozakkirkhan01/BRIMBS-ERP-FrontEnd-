import { Component } from "@angular/core";
import { PDFDocumentProxy, ZoomScale } from "ng2-pdf-viewer";
import { HttpClient } from "@angular/common/http";

import * as pdfMake from "pdfmake/build/pdfmake";
const pdfFonts = require('../../../assets/vfs_fonts');
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { styles, defaultStyle } from "../customStyles";
import { fonts } from "../pdfFonts";
import { ConstantData } from "../../utils/constant-data";


@Component({
  selector: 'app-pdf-container',
  templateUrl: './pdf-container.component.html',
  styleUrls: ['./pdf-container.component.css']
})
export class PdfContainerComponent {
  pdfSrc: any="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf"; // this sample, dynamic one we will generate with the pdfmake
  pageVariable:number = 1;

  // Initialize variables required for the header and this component
  fileName:string = "test-document.pdf";
  // set zoom variables
  zoom:number = 0.65; // default initial zoom value
  zoomMax:number = 2; // max zoom value
  zoomMin:number = 0.5; // min zoom value
  zoomAmt:number = 0.2; // stepping zoom values on button click
  zoomScale: ZoomScale = "page-width"; // zoom scale based on the page-width
  totalPages:number = 0; // indicates the total number of pages in the pdf document
  pdf: PDFDocumentProxy; // to access pdf information from the pdf viewer
  documentDefinition: TDocumentDefinitions;
  generatedPDF: any;

  constructor(private httpClient: HttpClient) {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    (pdfMake as any).fonts = fonts;
  }

  ngOnInit(): void {
    //this.getData();
    this.generatePDF();
  }

  // zoom functionality for the pdf viewer
  setZoom(type: string): void {
    if (type === "increment") {
      this.zoom += this.zoomAmt;
    } else if (type === "decrement") {
      this.zoom -= this.zoomAmt;
    }
  }

  download(): void {
    pdfMake.createPdf(this.documentDefinition).download();
  }

  // pdfSrc value we are taking from the pdfmake generate function in buffer type so currently this willnot work
  // after the pdf is generated it will work
  // Print functionlaity of the pdf
  print(): void {
    pdfMake.createPdf(this.documentDefinition).print();

    // // Remove previously added iframes
    // const prevFrames = document.querySelectorAll('iframe[name="pdf-frame"]');
    // if (prevFrames.length) {
    //   prevFrames.forEach((item) => item.remove());
    // }
    // // just like download , we are using the blob
    // const blob = new Blob([this.pdfSrc], { type: "application/pdf" });
    // const objectURl = URL.createObjectURL(blob);

    // // create iframe element in dom
    // const frame = document.createElement("iframe");
    // frame.style.display = "none"; // hiding the iframe
    // frame.src = objectURl; // setting the source for that iframe
    // // appending this iframe to body
    // document.body.appendChild(frame);
    // frame.name = "pdf-frame";
    // frame.focus();

    // // in edge or IE we are using different methods to print
    // if (this.isIE() || this.isEdge()) {
    //   (frame as any).contentWindow.document.execCommand("print", false, null);
    // } else {
    //   // all other browsers will use this method
    //   (frame as any).contentWindow.print();
    // }
  }

  // // to know the browser is IE or not
  // isIE(): boolean {
  //   return navigator.userAgent.lastIndexOf("MSIE") !== -1;
  // }

  // // to know the browser is Edge or not
  // isEdge(): boolean {
  //   return !this.isIE() && !!(window as any).StyleMedia;
  // }

  // after load complete of the pdf function
  afterLoadComplete(pdf: PDFDocumentProxy): void {
    this.pdf = pdf;
    this.totalPages = pdf.numPages;
  }

  generatePDF(): void {
    // All the contents required goes here
    this.documentDefinition = {
      info: {
        title: "Sample",
        author: ConstantData.DevelopedBy,
        subject: "Demo",
        keywords: "A",
        creator: ConstantData.DevelopedBy,
        creationDate: new Date(),
      },
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [40, 60, 40, 60], // left, top, right, bottom margin values
      content: [
        {
          text: "Sample test to check the font",
          style: "head", // normal text with custom font
        },
        {
          text: ">",
          font: "Icomoon", // icon intgerated to the pdfmake document
          fontSize: 18,
        },
      ], // it will be discussed later
      styles,
      defaultStyle,
    };

    // Generating the pdf
    this.generatedPDF = pdfMake.createPdf(this.documentDefinition);
    // This generated pdf buffer is used for the download, print and for viewing
    this.generatedPDF.getBuffer((buffer: any) => {
      this.pdfSrc = buffer;
    });
  }

  // getData(): void {
  //   this.httpClient.get("assets/data.json").subscribe((data) => {
  //     if (data) {
  //       this.pdfData = data;
  //       this.generatePDF();
  //     }
  //   });
  // }
}
