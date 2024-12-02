import { DatePipe } from '@angular/common';

export class Utils {
  getImagePadrao(): String {
    return '';
  }
  datePipe: DatePipe = new DatePipe('pt-BR');
  imagemArrayBuffer: string = '';

  /**
   * image api rest to Base64
   */
  arrayBufferToBase64(buffer: number[]): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  }

  resizeImageToBase64(base64Image: string, width: number, height: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const image = new Image();
      image.src = base64Image;
      console.log("base64 " + base64Image);

      image.onload = () => {
        const originalWidth = image.width;
        const originalHeight = image.height;

        if (originalWidth !== width || originalHeight !== height) {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext('2d');
          if(context != null)
            context.drawImage(image, 0, 0, width, height);

          const resizedBase64 = canvas.toDataURL('image/jpeg');
          resolve(resizedBase64);
        } else {
          resolve(base64Image);
        }
      };

      image.onerror = (error) => {
        reject(error);
      };
    });
  }

  formatarTempoPreparo(timestamp: number): string {
    const formattedTime = this.datePipe.transform(timestamp, 'HH:mm');
    return formattedTime || '00:00';
    //const formattedTime = ServiceLocator.datePipe.transform(timestamp, 'HH:mm');
    //return formattedTime !== null ? formattedTime : '00:00';
  }

  converterTempoPreparo(timeString: String): number {
    const currentTime = new Date();
    const timeStringParts = timeString.split(':');

    if (timeStringParts.length === 2) {
      currentTime.setHours(Number(timeStringParts[0]));
      currentTime.setMinutes(Number(timeStringParts[1]));
    } else {
      return 0;
    }
    // Defina o fuso horário para "America/Sao_Paulo" (Brasil)
  const brazilTimezone = "America/Sao_Paulo";
  currentTime.toLocaleString('en-US', { timeZone: brazilTimezone });

  // Obtenha o tempo em milissegundos
  const brazilTimeMilliseconds = currentTime.getTime();

  return brazilTimeMilliseconds;
  }

  convertBase64ToArrayBuffer(base64: string): number[] {

    if (base64 == null) {
      return Array.from([]);
    }

    const regex = /^data:image\/([a-zA-Z]+);base64,/;
    const matches = base64.match(regex);

    if (matches && matches.length > 1) {
      const imageFormat = matches[1];

      // Remova o prefixo
      base64 = base64.replace(matches[0], '');
    }
    base64 = base64.replace(/\s/g, '');

    // Remova caracteres inválidos da string base64 (cuidado ao fazer isso)
    base64 = base64.replace(/[^A-Za-z0-9+/]/g, '');
    const binaryString = atob(base64);
    const buffer = new ArrayBuffer(binaryString.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binaryString.length; i++) {
      view[i] = binaryString.charCodeAt(i);
    }
    return Array.from(new Uint8Array(buffer));
  }
}
