import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../service/security.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit {
  constructor(private service: SecurityService) {}
  ngOnInit(): void {}
  progress: boolean = true;
  similitud: string = '';
  upload(files: any) {
    if (files.length === 0) return;

    let fileToUpLoad = <File>files[0];
    const formData = new FormData();

    formData.append('file', fileToUpLoad, fileToUpLoad.name);
    this.service.updateFile(formData).subscribe((res) => {
      console.log(res);
    });
  }

  compareface(files: any) {
    if (files.length === 0) return;

    let fileToUpLoad = <File>files[0];
    const formData = new FormData();

    formData.append('file', fileToUpLoad, fileToUpLoad.name);
    this.service.compareFace(formData).subscribe((res: any) => {
      this.similitud = res['body'].similarity;
    });
  }
}
