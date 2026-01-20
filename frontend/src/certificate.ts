import jsPDF from "jspdf";

export function generateCertificate(data: {
  hash: string;
  issuer: string;
  purpose: string;
  issuedAt: number;
  expiresAt: number;
}) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("File Integrity Verification Certificate", 20, 20);

  doc.setFontSize(12);
  doc.text(`File Hash: ${data.hash}`, 20, 40);
  doc.text(`Issuer: ${data.issuer}`, 20, 50);
  doc.text(`Purpose: ${data.purpose}`, 20, 60);
  doc.text(
    `Issued At: ${new Date(data.issuedAt * 1000).toLocaleString()}`,
    20,
    70,
  );

  if (data.expiresAt !== 0) {
    doc.text(
      `Expires At: ${new Date(data.expiresAt * 1000).toLocaleString()}`,
      20,
      80,
    );
  } else {
    doc.text("Expires At: Never", 20, 80);
  }

  doc.text("Status: VALID", 20, 95);

  doc.save("file-integrity-certificate.pdf");
}
