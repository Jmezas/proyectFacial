import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FaceApiService } from './service/face-api.service';
import { SecurityService } from './service/security.service';
import { VideoPlayerService } from './service/video-player.service';
import html2canvas from 'html2canvas';
import * as _ from 'lodash';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public currentStream: any;
  public dimensionVideo: any;
  listEvents: Array<any> = [];
  overCanvas: any;
  listExpressions: any = [];

  imgcreada = false;
  imagenCreada: any;
  similitud: any;
  constructor(
    private faceApiService: FaceApiService,
    private videoPlayerService: VideoPlayerService,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private service: SecurityService
  ) {}
  ngOnInit(): void {
    this.listenerEvents();
    this.checkMediaSource();
    this.getSizeCam();
  }

  ngOnDestroy(): void {
    this.listEvents.forEach((event) => event.unsubscribe());
  }
  listenerEvents = () => {
    const observer1$ = this.videoPlayerService.cbAi.subscribe(
      ({ resizedDetections, displaySize, expressions, videoElement }) => {
        resizedDetections = resizedDetections[0] || null;
        // :TODO Aqui pintamos! dibujamos!
        if (resizedDetections) {
          this.listExpressions = _.map(expressions, (value, name) => {
            return { name, value };
          });
          this.createCanvasPreview(videoElement);
          this.drawFace(resizedDetections, displaySize);
        }
      }
    );

    this.listEvents = [observer1$];
  };

  drawFace = (resizedDetections: any, displaySize: any) => {
    if (this.overCanvas) {
      const { globalFace } = this.faceApiService;
      this.overCanvas
        .getContext('2d')
        .clearRect(0, 0, displaySize.width, displaySize.height);
      globalFace.draw.drawFaceLandmarks(this.overCanvas, resizedDetections);
    }
  };

  checkMediaSource = () => {
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: true,
        })
        .then((stream) => {
          this.currentStream = stream;
        })
        .catch(() => {
          console.log('**** ERROR NOT PERMISSIONS *****');
        });
    } else {
      console.log('******* ERROR NOT FOUND MEDIA DEVICES');
    }
  };

  getSizeCam = () => {
    const elementCam: HTMLElement = document.querySelector(
      '.cam'
    ) as HTMLElement;
    const { width, height } = elementCam.getBoundingClientRect();
    this.dimensionVideo = { width, height };
  };

  createCanvasPreview = (videoElement: any) => {
    if (!this.overCanvas) {
      const { globalFace } = this.faceApiService;
      this.overCanvas = globalFace.createCanvasFromMedia(
        videoElement.nativeElement
      );
      this.renderer2.setProperty(this.overCanvas, 'id', 'new-canvas-preview');
      const elementPreview = document.querySelector('.canvas-preview');
      this.renderer2.appendChild(elementPreview, this.overCanvas);
    }
  };

  generateImage() {
    html2canvas(document.querySelector('#image-section') as HTMLElement).then(
      (canvas) => {
        this.imagenCreada = canvas.toDataURL();
        //console.log(this.imagenCreada);
      }
    );
    this.imgcreada = true;
    const base64 = this.imagenCreada;
    const imageName = 'name.png';
    const imageBlob = this.dataURItoBlob(
      base64.replace('data:image/png;base64,', '')
    );
    const imageFile: any = new File([imageBlob], imageName, {
      type: 'image/png',
    });

    //compare
    let fileToUpLoad = <File>imageFile;
    console.log(fileToUpLoad);
    const formData = new FormData();

    formData.append('file', imageFile, imageFile.name);
    this.service.compareFace(formData).subscribe((res: any) => {
      console.log(res['body']);
      this.similitud = res['body'].similarity;
    });
  }

  dataURItoBlob(dataURI: any) {
    console.log(dataURI);
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }
}
