import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  authenticate(email: string, password: string): Observable<boolean> {
    // Simulăm citirea datelor dintr-un fișier Excel
    // Într-o aplicație reală, aceasta ar trebui înlocuită cu o cerere către un server/backend
    const filePath = '/path/to/your/passem.xlsx'; // Actualizați cu calea corectă a fișierului
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Verificăm dacă există o potrivire pentru email și parolă
    const user = data.find((user: any) => user.email === email && user.parola === password);
    return of(!!user);
  }
}
