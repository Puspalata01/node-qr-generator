
const inquirer = require('inquirer').default;

const qr = require('qr-image');
const fs = require('fs');

(async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'text',
        message: 'Enter the text or URL to encode into the QR code:',
        validate: v => v.trim() !== '' || 'Please enter something.'
      },
      {
        type: 'input',
        name: 'filename',
        message: 'Output filename (without extension):',
        default: 'qr_code'
      },
      {
        type: 'list',
        name: 'format',
        message: 'Choose image format:',
        choices: ['png', 'svg'],
        default: 'png'
      },
      {
        type: 'input',
        name: 'size',
        message: 'PNG size value (bigger → larger image; try 6-10):',
        default: '8',
        validate: v => !isNaN(parseInt(v)) || 'Enter a number'
      }
    ]);

    const { text, filename, format, size } = answers;
    const options = { ec_level: 'H' }; 
    if (format === 'png') options.size = parseInt(size, 10);

    const outputPath = `${filename}.${format}`;
    
    const qrStream = qr.image(text, { type: format, ...options });
    const writeStream = fs.createWriteStream(outputPath);

    qrStream.pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`\n✅ QR code saved to: ${outputPath}`);
      console.log('Open the file to view it (or use the command below).');
      console.log(`PowerShell: ii ${outputPath}    (or)    Windows cmd: start ${outputPath}\n`);
    });

    writeStream.on('error', (err) => {
      console.error('Error writing file:', err);
    });

  } catch (err) {
    console.error('Error:', err);
  }
})();
