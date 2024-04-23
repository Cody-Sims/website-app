import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import React from 'react'
import '@react-pdf-viewer/core/lib/styles/index.css';

const Resume = () => (
    <div className="container-resume">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
                fileUrl="/assets/resume.pdf"
                defaultScale={1.5} // Set the default zoom level to 60%
            />
        </Worker>
    </div>
);

export default Resume;


