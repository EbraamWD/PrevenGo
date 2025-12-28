import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Helper function to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(amount);
};

// Helper function to draw rounded rectangle
const drawRoundedRect = (doc, x, y, width, height, radius, fillColor) => {
    doc.save();
    doc.roundedRect(x, y, width, height, radius);
    if (fillColor) {
        doc.fillColor(fillColor);
        doc.fill();
    }
    doc.restore();
};

// Helper function to calculate text height
const calculateTextHeight = (doc, text, width, fontSize, font = 'Helvetica') => {
    doc.font(font).fontSize(fontSize);
    return doc.heightOfString(text, { width });
};

// Helper function to add footer to current page
const addFooter = (doc) => {
    const pageHeight = doc.page.height;
    const pageWidth = doc.page.width;
    const margin = 50;
    const footerY = pageHeight - 30;

    doc.fillColor('#9ca3af')
        .fontSize(8)
        .font('Helvetica')
        .text('Preventivo creato con <3 con PrevenGo', margin, footerY, {
            width: pageWidth - (margin * 2),
            align: 'center'
        });
};

export const generatePDF = async (quote, user, options = { save: false }) => {
    return new Promise(async (resolve, reject) => {
        try {

            const doc = new PDFDocument({
                margin: 50,
                size: 'A4',
                info: {
                    Title: `Preventivo ${quote._id}`,
                    Author: 'Prevengo',
                    Subject: 'Preventivo',
                    Creator: 'Prevengo PDF Generator'
                }
            });
            const buffers = [];

            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", async () => {
                try {
                    const pdfBuffer = Buffer.concat(buffers);
                    if (options.save) {
                        const quotesDir = path.join(process.cwd(), 'quotes');
                        if (!fs.existsSync(quotesDir)) {
                            fs.mkdirSync(quotesDir, { recursive: true });
                        }
                        const filePath = path.join(quotesDir, `${quote.customerName}.pdf`);
                        fs.writeFileSync(filePath, pdfBuffer);
                        resolve({ pdfBuffer, filePath });
                    } else {
                        resolve({ pdfBuffer });
                    }
                } catch (error) {
                    reject(error);
                }
            });

            doc.on("error", (error) => {
                reject(error);
            });

            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;
            const margin = 50;
            const contentWidth = pageWidth - (margin * 2);
            const footerSpace = 50; // Spazio riservato per il footer
            let yPosition = margin;

            // ========== HEADER SECTION - DATI AZIENDA ==========
            // Logo e dati azienda (colonna sinistra)
            // Logo e dati azienda (colonna sinistra)
            const logoWidth = 100;
            const logoHeight = 100;
            const companyInfoX = margin;

            if (user.logoUrl) {
                try {
                    // Se è un URL remoto, scarica l'immagine
                    if (user.logoUrl.startsWith('http://') || user.logoUrl.startsWith('https://')) {
                        const https = await import('https');
                        const http = await import('http');

                        const client = user.logoUrl.startsWith('https://') ? https : http;

                        const imageBuffer = await new Promise((resolve, reject) => {
                            client.get(user.logoUrl, (response) => {
                                const chunks = [];
                                response.on('data', (chunk) => chunks.push(chunk));
                                response.on('end', () => resolve(Buffer.concat(chunks)));
                                response.on('error', reject);
                            }).on('error', reject);
                        });

                        doc.image(imageBuffer, companyInfoX, yPosition, {
                            width: logoWidth,
                            height: logoHeight,
                            fit: [logoWidth, logoHeight]
                        });
                    }
                    // Se è un percorso locale
                    else if (fs.existsSync(user.logoUrl)) {
                        doc.image(user.logoUrl, companyInfoX, yPosition, {
                            width: logoWidth,
                            fit: [logoWidth, 60]
                        });
                    }
                } catch (error) {
                    console.error('Error loading logo:', error);
                }
            }

            // Dati azienda (mittente)
            const companyDataX = companyInfoX + (user.logoUrl ? logoWidth + 5 : 0);
            doc.fillColor('#1f2937')
                .fontSize(12)
                .font('Helvetica-Bold')
                .text(user.companyName || 'Nome Azienda', companyDataX, yPosition);

            doc.fontSize(9)
                .font('Helvetica')
                .fillColor('#4b5563')
                .text(user.companyAddress || '', companyDataX, yPosition + 16)
                .text(`P.IVA: ${user.vatNumber || ''}`, companyDataX, yPosition + 40)
                .text(`Tel: ${user.companyPhone || ''}`, companyDataX, yPosition + 52);

            if (quote.companyEmail) {
                doc.text(`Email: ${quote.companyEmail}`, companyDataX, yPosition + 64);
            }

            // Box PREVENTIVO (colonna destra)
            const preventivoBoxWidth = 180;
            const preventivoBoxX = pageWidth - margin - preventivoBoxWidth;
            const preventivoBoxHeight = 85;

            drawRoundedRect(doc, preventivoBoxX, yPosition, preventivoBoxWidth, preventivoBoxHeight, 8, '#2563eb');

            doc.fillColor('#ffffff')
                .fontSize(24)
                .font('Helvetica-Bold')
                .text('PREVENTIVO', preventivoBoxX, yPosition + 15, {
                    width: preventivoBoxWidth,
                    align: 'center'
                });

            // Numero e Data preventivo
            const quoteNumber = quote.quoteNumber || quote._id.toString().substring(0, 8).toUpperCase();
            const quoteDate = new Date(quote.createdAt || Date.now());

            doc.fontSize(10)
                .font('Helvetica')
                .fillColor('#bfdbfe')
                .text(`N. ${quoteNumber}`, preventivoBoxX, yPosition + 48, {
                    width: preventivoBoxWidth,
                    align: 'center'
                })
                .text(`del ${quoteDate.toLocaleDateString('it-IT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}`, preventivoBoxX, yPosition + 63, {
                    width: preventivoBoxWidth,
                    align: 'center'
                });

            yPosition += 110;

            // Linea separatore
            doc.strokeColor('#e5e7eb')
                .lineWidth(1)
                .moveTo(margin, yPosition)
                .lineTo(pageWidth - margin, yPosition)
                .stroke();

            yPosition += 25;

            // ========== DESTINATARIO (CLIENTE) ==========
            doc.fillColor('#1f2937')
                .fontSize(11)
                .font('Helvetica-Bold')
                .text('Spett.le', margin, yPosition);

            yPosition += 18;

            const clientBoxHeight = quote.customerCompany ? 100 : 70;
            drawRoundedRect(doc, margin, yPosition, contentWidth * 0.55, clientBoxHeight, 8, '#eff6ff');

            doc.strokeColor('#2563eb')
                .lineWidth(1.5)
                .roundedRect(margin, yPosition, contentWidth * 0.55, clientBoxHeight, 8)
                .stroke();

            let clientY = yPosition + 15;

            // Nome azienda cliente (se presente)
            if (quote.customerCompany) {
                doc.fillColor('#1f2937')
                    .fontSize(11)
                    .font('Helvetica-Bold')
                    .text(quote.customerCompany, margin + 15, clientY);
                clientY += 18;
            }

            // Nome contatto
            doc.fillColor('#374151')
                .fontSize(10)
                .font('Helvetica')
                .text(quote.customerName || 'Nome Cognome', margin + 15, clientY);

            clientY += 16;

            // Email
            if (quote.customerEmail) {
                doc.fillColor('#6b7280')
                    .text(quote.customerEmail, margin + 15, clientY);
                clientY += 16;
            }

            // Telefono
            if (quote.customerPhone) {
                doc.fillColor('#6b7280')
                    .text(quote.customerPhone, margin + 15, clientY);
            }

            yPosition += clientBoxHeight + 30;

            // ========== OGGETTO ==========
            if (quote.subject) {
                doc.fillColor('#1f2937')
                    .fontSize(10)
                    .font('Helvetica-Bold')
                    .text('Oggetto: ', margin, yPosition, { continued: true })
                    .font('Helvetica')
                    .fillColor('#4b5563')
                    .text(quote.subject);

                yPosition += 25;
            }

            // ========== TABELLA ARTICOLI ==========
            doc.fillColor('#1f2937')
                .fontSize(12)
                .font('Helvetica-Bold')
                .text('Dettaglio Servizi/Prodotti', margin, yPosition);

            yPosition += 20;

            // Intestazione tabella
            const tableHeaderHeight = 30;
            const colWidths = {
                pos: 30,
                desc: contentWidth * 0.42,
                qty: contentWidth * 0.10,
                unit: contentWidth * 0.08,
                price: contentWidth * 0.15,
                total: contentWidth * 0.15
            };

            // Header background con gradiente
            doc.rect(margin, yPosition, contentWidth, tableHeaderHeight)
                .fillAndStroke('#1d4ed8', '#1e40af');

            doc.fillColor('#ffffff')
                .fontSize(9)
                .font('Helvetica-Bold')
                .text('POS', margin + 5, yPosition + 10, { width: colWidths.pos - 10, align: 'center' });

            let colX = margin + colWidths.pos;
            doc.text('DESCRIZIONE', colX + 5, yPosition + 10, { width: colWidths.desc - 10 });

            colX += colWidths.desc;
            doc.text('Q.TÀ', colX + 5, yPosition + 10, { width: colWidths.qty - 10, align: 'center' });

            colX += colWidths.qty;
            doc.text('U.M.', colX + 5, yPosition + 10, { width: colWidths.unit - 10, align: 'center' });

            colX += colWidths.unit;
            doc.text('PREZZO UNIT.', colX + 5, yPosition + 10, { width: colWidths.price - 10, align: 'right' });

            colX += colWidths.price;
            doc.text('TOTALE', colX + 5, yPosition + 10, { width: colWidths.total - 10, align: 'right' });

            yPosition += tableHeaderHeight;

            // Righe tabella con altezza dinamica
            quote.items.forEach((item, index) => {
                // Calcola l'altezza necessaria per la descrizione
                const descHeight = calculateTextHeight(doc, item.description || 'Descrizione articolo', colWidths.desc - 10, 9, 'Helvetica-Bold');
                const rowHeight = Math.max(35, descHeight + 20); // Minimo 35px, altrimenti altezza del testo + padding

                // Controlla se serve nuova pagina (lascia spazio per footer e totali)
                if (yPosition + rowHeight + 250 > pageHeight - footerSpace) {
                    addFooter(doc);
                    doc.addPage();
                    yPosition = margin;

                    // Ripeti l'intestazione della tabella
                    doc.rect(margin, yPosition, contentWidth, tableHeaderHeight)
                        .fillAndStroke('#1d4ed8', '#1e40af');

                    doc.fillColor('#ffffff')
                        .fontSize(9)
                        .font('Helvetica-Bold')
                        .text('POS', margin + 5, yPosition + 10, { width: colWidths.pos - 10, align: 'center' });

                    colX = margin + colWidths.pos;
                    doc.text('DESCRIZIONE', colX + 5, yPosition + 10, { width: colWidths.desc - 10 });

                    colX += colWidths.desc;
                    doc.text('Q.TÀ', colX + 5, yPosition + 10, { width: colWidths.qty - 10, align: 'center' });

                    colX += colWidths.qty;
                    doc.text('U.M.', colX + 5, yPosition + 10, { width: colWidths.unit - 10, align: 'center' });

                    colX += colWidths.unit;
                    doc.text('PREZZO UNIT.', colX + 5, yPosition + 10, { width: colWidths.price - 10, align: 'right' });

                    colX += colWidths.price;
                    doc.text('TOTALE', colX + 5, yPosition + 10, { width: colWidths.total - 10, align: 'right' });

                    yPosition += tableHeaderHeight;
                }

                // Sfondo alternato
                if (index % 2 === 0) {
                    doc.rect(margin, yPosition, contentWidth, rowHeight)
                        .fillColor('#f9fafb')
                        .fill();
                }

                // Bordo riga
                doc.strokeColor('#e5e7eb')
                    .lineWidth(0.5)
                    .moveTo(margin, yPosition + rowHeight)
                    .lineTo(margin + contentWidth, yPosition + rowHeight)
                    .stroke();

                // Calcola il centro verticale per allineare il contenuto
                const verticalCenter = yPosition + (rowHeight / 2) - 6;

                // Posizione
                doc.fillColor('#6b7280')
                    .fontSize(9)
                    .font('Helvetica')
                    .text(String(index + 1), margin + 5, verticalCenter, {
                        width: colWidths.pos - 10,
                        align: 'center'
                    });

                // Descrizione (allineata in alto con padding)
                colX = margin + colWidths.pos;
                doc.fillColor('#1f2937')
                    .fontSize(9)
                    .font('Helvetica-Bold')
                    .text(item.description || 'Descrizione articolo', colX + 5, yPosition + 10, {
                        width: colWidths.desc - 10
                    });

                // Quantità
                colX += colWidths.desc;
                doc.fillColor('#374151')
                    .font('Helvetica')
                    .text(String(item.quantity || 1), colX + 5, verticalCenter, {
                        width: colWidths.qty - 10,
                        align: 'center'
                    });

                // Unità di misura
                colX += colWidths.qty;
                doc.fillColor('#6b7280')
                    .text(item.unit || 'pz', colX + 5, verticalCenter, {
                        width: colWidths.unit - 10,
                        align: 'center'
                    });

                // Prezzo unitario
                colX += colWidths.unit;
                doc.fillColor('#374151')
                    .text(formatCurrency(item.unitPrice || 0), colX + 5, verticalCenter, {
                        width: colWidths.price - 10,
                        align: 'right'
                    });

                // Totale riga
                colX += colWidths.price;
                const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
                doc.fillColor('#1f2937')
                    .font('Helvetica-Bold')
                    .text(formatCurrency(itemTotal), colX + 5, verticalCenter, {
                        width: colWidths.total - 10,
                        align: 'right'
                    });

                yPosition += rowHeight;
            });

            yPosition += 15;

            // ========== RIEPILOGO TOTALI ==========
            const totalsBoxWidth = 250;
            const totalsX = margin + contentWidth - totalsBoxWidth;

            // Box totali
            const totalsRows = [
                { label: 'Imponibile', value: quote.subTotal || 0, bold: false },
                { label: `IVA ${quote.taxRate || 22}%`, value: quote.tax || 0, bold: false },
            ];

            // Se ci sono sconti
            if (quote.discount && quote.discount > 0) {
                totalsRows.unshift({
                    label: `Sconto ${quote.discountPercentage || ''}%`,
                    value: -quote.discount,
                    bold: false
                });
            }

            let totalsY = yPosition;
            const rowHeight = 22;

            totalsRows.forEach((row, idx) => {
                doc.fillColor('#374151')
                    .fontSize(10)
                    .font('Helvetica')
                    .text(row.label, totalsX, totalsY)
                    .text(formatCurrency(row.value), totalsX + totalsBoxWidth - 80, totalsY, {
                        width: 80,
                        align: 'right'
                    });
                totalsY += rowHeight;
            });

            // Linea separatore
            doc.strokeColor('#2563eb')
                .lineWidth(2)
                .moveTo(totalsX, totalsY + 5)
                .lineTo(totalsX + totalsBoxWidth, totalsY + 5)
                .stroke();

            totalsY += 15;

            // TOTALE FINALE
            const totalBoxHeight = 40;
            drawRoundedRect(doc, totalsX, totalsY, totalsBoxWidth, totalBoxHeight, 8, '#2563eb');

            doc.fillColor('#ffffff')
                .fontSize(13)
                .font('Helvetica-Bold')
                .text('TOTALE PREVENTIVO', totalsX + 10, totalsY + 12)
                .fontSize(16)
                .text(formatCurrency(quote.total || 0), totalsX + 10, totalsY + 12, {
                    width: totalsBoxWidth - 20,
                    align: 'right'
                });

            yPosition = totalsY + totalBoxHeight + 30;

            // ========== NOTE E CONDIZIONI ==========
            // Note aggiuntive
            if (quote.notes) {
                // Calcola spazio necessario
                const notesHeight = calculateTextHeight(doc, quote.notes, contentWidth, 9, 'Helvetica');
                const neededSpace = notesHeight + 60; // +60 per titolo e padding

                // Controlla se serve nuova pagina
                if (yPosition + neededSpace + footerSpace + 20 > pageHeight - footerSpace) {
                    addFooter(doc);
                    doc.addPage();
                    yPosition = margin;
                }

                doc.fillColor('#1f2937')
                    .fontSize(10)
                    .font('Helvetica-Bold')
                    .text('Note', margin, yPosition);

                yPosition += 18;

                doc.fillColor('#4b5563')
                    .fontSize(9)
                    .font('Helvetica')
                    .text(quote.notes, margin, yPosition, {
                        width: contentWidth,
                        align: 'justify'
                    });

                yPosition += notesHeight + 25;
            }

            // Condizioni di pagamento (solo se quote.paymentTerms esiste)
            if (quote.paymentTerms) {
                const validityBox = 60;

                // Controlla se serve nuova pagina
                if (yPosition + validityBox + footerSpace + 20 > pageHeight - footerSpace) {
                    addFooter(doc);
                    doc.addPage();
                    yPosition = margin;
                }

                drawRoundedRect(doc, margin, yPosition, contentWidth, validityBox, 8, '#eff6ff');

                doc.strokeColor('#2563eb')
                    .lineWidth(1)
                    .roundedRect(margin, yPosition, contentWidth, validityBox, 8)
                    .stroke();

                doc.fillColor('#1d4ed8')
                    .fontSize(10)
                    .font('Helvetica-Bold')
                    .text('✓ Preventivo valido 30 giorni', margin + 20, yPosition + 15, {
                        width: contentWidth - 40,
                        align: 'center'
                    });

                doc.fillColor('#6b7280')
                    .fontSize(8)
                    .font('Helvetica')
                    .text(quote.paymentTerms, margin + 20, yPosition + 35, {
                        width: contentWidth - 40,
                        align: 'center'
                    });

                yPosition += validityBox + 20;
            }

            // Aggiungi footer alla pagina corrente
            addFooter(doc);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};