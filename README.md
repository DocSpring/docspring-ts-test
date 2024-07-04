# DocSpring TypeScript API Examples

This repository contains code snippets and examples demonstrating how to use the DocSpring TypeScript API library (`docspring-ts`).

Currently the example available in index.ts is creating a PDF then polling our server to wait for the PDF being processed before fetching the file
and then converting to base64 string. If you have any requests for additional code snippets please contact support@docspring.com or reach out via the
chat at https://www.docspring.com

## Getting Started

`npm install`

or if you prefer yarn

`yarn install`

setup a .env file

```
DOCSPRING_USERNAME=your_api_username
DOCSPRING_PASSWORD=your_api_password
```

There is a `DOCSPRING_BASE_URL` which will only be necessary to set if you are connecting to the EU servers. In this case use:
```
DOCSPRING_BASE_URL=https://api-eu.docspring.com/api/v1
```


### Prerequisites

- Node.js (version 12.x or higher)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/DocSpring/docspring-ts-test.git
   cd docspring-ts-test

