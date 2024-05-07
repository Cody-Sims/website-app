import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import React from 'react'
import '@react-pdf-viewer/core/lib/styles/index.css';
import Head from 'next/head';

export default function Resume() {
    const defaultScale = window.innerWidth < 768 ? 0.7 : 1.5;
    return (
        <div style={{ maxWidth: "100vw"}}>
            <Head>
                <title>Resume</title>
                <meta
                    name="description"
                    content="Welcome to my resume, I am a software engineer at Microsoft and a Brown University Alumni. I am proficient at Javascript, C++,"
                />
            </Head>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                    fileUrl="/assets/resume.pdf"
                    defaultScale={defaultScale}
                />
            </Worker>
        </div>
    );
};
