import { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Award, Download, ExternalLink, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CertificateGeneratorProps {
  studentName: string;
  certificateNumber: string;
  courseTitle: string;
  completionDate: string;
  verificationUrl: string;
}

const CertificateGenerator = ({
  studentName,
  certificateNumber,
  courseTitle,
  completionDate,
  verificationUrl
}: CertificateGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateCertificatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Create PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([842, 595]); // A4 Landscape
      
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

      const { width, height } = page.getSize();

      // Background gradient effect (silver/platinum theme)
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(0.08, 0.08, 0.12),
      });

      // Decorative border
      const borderWidth = 4;
      page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderColor: rgb(0.7, 0.75, 0.8), // Silver
        borderWidth,
      });

      // Inner decorative line
      page.drawRectangle({
        x: 35,
        y: 35,
        width: width - 70,
        height: height - 70,
        borderColor: rgb(0.5, 0.55, 0.6),
        borderWidth: 1,
      });

      // Header - UTAMV
      page.drawText('UTAMV', {
        x: width / 2 - 80,
        y: height - 100,
        size: 48,
        font: helveticaBold,
        color: rgb(0.7, 0.75, 0.8),
      });

      // Subtitle
      page.drawText('UNIVERSIDAD TÉCNICA DE ADMINISTRACIÓN VIRTUAL', {
        x: width / 2 - 200,
        y: height - 130,
        size: 12,
        font: helvetica,
        color: rgb(0.6, 0.65, 0.7),
      });

      // Certificate title
      page.drawText('CERTIFICADO DE FINALIZACIÓN', {
        x: width / 2 - 150,
        y: height - 180,
        size: 22,
        font: helveticaBold,
        color: rgb(0.85, 0.87, 0.9),
      });

      // Decorative line
      page.drawLine({
        start: { x: 150, y: height - 200 },
        end: { x: width - 150, y: height - 200 },
        thickness: 1,
        color: rgb(0.5, 0.55, 0.6),
      });

      // "Se certifica que" text
      page.drawText('Se certifica que', {
        x: width / 2 - 50,
        y: height - 240,
        size: 14,
        font: timesItalic,
        color: rgb(0.6, 0.65, 0.7),
      });

      // Student name
      const nameWidth = helveticaBold.widthOfTextAtSize(studentName.toUpperCase(), 32);
      page.drawText(studentName.toUpperCase(), {
        x: width / 2 - nameWidth / 2,
        y: height - 280,
        size: 32,
        font: helveticaBold,
        color: rgb(0.9, 0.92, 0.95),
      });

      // Underline for name
      const nameWidth = studentName.length * 24;
      page.drawLine({
        start: { x: width / 2 - nameWidth / 2, y: height - 290 },
        end: { x: width / 2 + nameWidth / 2, y: height - 290 },
        thickness: 2,
        color: rgb(0.7, 0.75, 0.8),
      });

      // Course completion text
      page.drawText('ha completado satisfactoriamente el programa', {
        x: width / 2 - 140,
        y: height - 330,
        size: 14,
        font: helvetica,
        color: rgb(0.6, 0.65, 0.7),
      });

      // Course title
      page.drawText(courseTitle, {
        x: width / 2 - (courseTitle.length * 7),
        y: height - 370,
        size: 20,
        font: helveticaBold,
        color: rgb(0.85, 0.87, 0.9),
      });

      // Completion date
      page.drawText(`Fecha de emisión: ${completionDate}`, {
        x: width / 2 - 80,
        y: height - 420,
        size: 12,
        font: helvetica,
        color: rgb(0.5, 0.55, 0.6),
      });

      // Certificate number
      page.drawText(`Certificado N°: ${certificateNumber}`, {
        x: width / 2 - 90,
        y: height - 445,
        size: 12,
        font: helveticaBold,
        color: rgb(0.7, 0.75, 0.8),
      });

      // Generate QR Code
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 100,
        margin: 1,
        color: {
          dark: '#b8bcc4',
          light: '#14141c'
        }
      });

      // Embed QR code
      const qrImageBytes = await fetch(qrDataUrl).then(res => res.arrayBuffer());
      const qrImage = await pdfDoc.embedPng(qrImageBytes);
      
      page.drawImage(qrImage, {
        x: width - 140,
        y: 50,
        width: 80,
        height: 80,
      });

      // QR label
      page.drawText('Verificar', {
        x: width - 125,
        y: 40,
        size: 10,
        font: helvetica,
        color: rgb(0.5, 0.55, 0.6),
      });

      // Signature area
      page.drawLine({
        start: { x: 150, y: 100 },
        end: { x: 350, y: 100 },
        thickness: 1,
        color: rgb(0.5, 0.55, 0.6),
      });

      page.drawText('Director Académico', {
        x: 200,
        y: 80,
        size: 12,
        font: helvetica,
        color: rgb(0.5, 0.55, 0.6),
      });

      page.drawText('UTAMV', {
        x: 230,
        y: 65,
        size: 10,
        font: helvetica,
        color: rgb(0.4, 0.45, 0.5),
      });

      // Footer text
      page.drawText('Orgullosamente Realmontenses - Latinoamérica', {
        x: 60,
        y: 40,
        size: 10,
        font: timesItalic,
        color: rgb(0.4, 0.45, 0.5),
      });

      page.drawText('Tecnología TAMV ONLINE', {
        x: 60,
        y: 25,
        size: 8,
        font: helvetica,
        color: rgb(0.3, 0.35, 0.4),
      });

      // Save and download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `UTAMV-Certificado-${certificateNumber}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);

      toast({
        title: '¡Certificado generado!',
        description: 'Tu certificado UTAMV ha sido descargado.',
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el certificado. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="card-elite p-6 border-silver-primary/30">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-silver flex items-center justify-center shadow-silver">
          <Award className="w-8 h-8 text-background" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-gradient-silver">
            Certificación UTAMV
          </h3>
          <p className="text-sm text-muted-foreground">
            Certificado N°: {certificateNumber}
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-4 rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">Estudiante</p>
          <p className="font-semibold text-foreground">{studentName}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">Programa</p>
          <p className="font-semibold text-foreground">{courseTitle}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">Fecha de emisión</p>
          <p className="font-semibold text-foreground">{completionDate}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          variant="elite" 
          className="flex-1"
          onClick={generateCertificatePDF}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open(verificationUrl, '_blank')}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CertificateGenerator;
