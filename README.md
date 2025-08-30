# AI-Summarizer

AI Summarizer is an application that takes any document (PDF/ Image) and generates smart summaries.

## Candidate details

- Name : Abhishek Sharma
- Roll Number : 2201641530010
- Course : B.Tech.
- Branch : Computer Science and Engineering
- Email Id : abhisheksharma801831@gmail.com
- Phone Number : 9838988251

## Features

1. Document Upload:
    - Allows users to upload PDF files and image files.
    - Supports drag-and-drop and file picker interface for easy uploads.

2. Text Extraction:
    - PDF Parsing: Extracts text from PDFs while maintaining formatting.
    - OCR (Optical Character Recognition): For image files (scanned documents), extracts text using OCR technology - Tesseract.

3. Summary Generation:
    - Automatically generates smart summaries of the document content.
    - Options are provided for summary length (short, medium, long).
    - Highlights key points and main ideas, ensuring the summary captures essential information.

4. Improvement Suggestions:
    - On the basis on content of the document, smart suggestions are provided

5. UI/UX:
    - Simple, intuitive interface for uploading documents and viewing summaries.
    - Responsive design for use on different devices.

6. Hosting:
    - Backend Deployed Link : https://summarizer-unthk-backend.vercel.app/
    - Frontend Deployed Link : https://summarizer-unthk-frontend.vercel.app/

## Technologies Used

- Backend : Node.js, Express.js, Gemini AI
- Frontend : Next.js, Tailwind CSS

## Prerequisites

1. Create a `.env` file inside both frontend and backend directories

2. Copy and paste fields from `.env.sample`

3. For backend you would need Gemini API
 
    - Go to https://aistudio.google.com/apikey 
 
    - Generate an API Key
 
    - Copy and Paste it inside `.env` file as - 

        ```bash
        GEMINI_API_KEY=YOUR_API_KEY
        ```
    
    - Do not change other fields


## Usage

- Go to Backend directory :
    
    1. Install Packages :

        ```bash
        npm install
        ```

    2. Start the server :

        ```bash
        npm run dev
        ```

    3. Backend server should be live at http://localhost:5000


- Go to Frontend directory :
    
    1. Install Packages :

        ```bash
        npm install
        ```

    2. Start the application :

        ```bash
        npm run dev
        ```

    3. Backend server should be live at http://localhost:3000


- Open browser and Go to http://localhost:3000



