import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-graphic-background',
  templateUrl: './graphic-background.component.html',
  styleUrls: ['./graphic-background.component.css']
})
export class GraphicBackgroundComponent implements AfterViewInit {
  @ViewChild('bg3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;


  @ViewChild('cylinderWrapper', { static: true }) cylinderWrapper!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.initThree();
    this.animate();
    this.updateRotation();

  }

  private initThree(): void {
    this.scene = new THREE.Scene();

    // const width = window.innerWidth;
    // const height = window.innerHeight;
    const parent = this.canvasRef.nativeElement.parentElement!;
    const width = parent.clientWidth;
    const height = parent.clientHeight;


    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 3;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    this.scene.add(light);

    // Example: simple cube (you can replace with GLB model later)
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  private targetRotationX = 0;
  private targetRotationY = 0;

  // tune these two 👇
  private scrollEffect = 0.0015;  // smaller = less rotation per scroll distance
  private smoothness = 0.8;      // smaller = smoother transition (less jerky)


  private animate = () => {
    // requestAnimationFrame(this.animate);
    // this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);

    // smooth rotation to avoid jumps
    // this.cube.rotation.x += (this.targetRotationX - this.cube.rotation.x) * this.smoothness;
    this.cube.rotation.y += (this.targetRotationY - this.cube.rotation.y) * this.smoothness;

    this.renderer.render(this.scene, this.camera);

  }

  @HostListener('window:scroll', [])
  onScroll() {
    const scrollY = window.scrollY;
    // this.cube.rotation.y = scrollY * 0.09;
    // this.cube.rotation.x = scrollY * 0.003;
    // limit how much scroll affects rotation
    this.targetRotationY = scrollY * this.scrollEffect * 9; // Y-axis rotation
    this.targetRotationX = scrollY * this.scrollEffect;     // X-axis rotation
    // this.updateRotation();

  }

  @HostListener('window:resize', [])
  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private updateRotation() {
    const section = this.cylinderWrapper.nativeElement.parentElement!;
    const rect = section.getBoundingClientRect();

    // // progress from 0 → 1
    // const progress = Math.min(Math.max(0, -rect.top / rect.height), 1);

    const viewportHeight = window.innerHeight;

    // Start rotation only when section enters viewport
    const progress = Math.min(Math.max(0, (viewportHeight - rect.top) / (rect.height + viewportHeight)), 1);


    // rotate full 360° as user scrolls
    const rotationY = progress * 360;

    this.cylinderWrapper.nativeElement.style.transform = `rotateY(${rotationY}deg)`;
  }

  scrollProgress = 0; // track virtual scroll progress (0–1)
  private isScrollLocked = false;


  @HostListener('wheel', ['$event'])
onWheel(event: WheelEvent) {
  this.handleScroll(event.deltaY, event.deltaX);
}

private touchStartX = 0;
private touchStartY = 0;

@HostListener('touchstart', ['$event'])
onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  this.touchStartY = event.touches[0].clientY;
}

@HostListener('touchmove', ['$event'])
onTouchMove(event: TouchEvent) {
  const currentX = event.touches[0].clientX;
  const currentY = event.touches[0].clientY;
  const deltaX = this.touchStartX - currentX; // swipe left/right
  const deltaY = this.touchStartY - currentY; // positive = scroll down
  this.touchStartX = currentX;
  this.touchStartY = currentY;

  this.handleScroll(deltaY, deltaX);
}

private handleScroll(deltaY: number, deltaX: number) {
  const section = this.cylinderWrapper.nativeElement.parentElement!;
  const rect = section.getBoundingClientRect();

  // Calculate section + viewport centers
  const sectionCenter = rect.top + rect.height / 2;
  const viewportCenter = window.innerHeight / 2;
  const threshold = 50;

  const sectionInView = Math.abs(sectionCenter - viewportCenter) < threshold;

  if (sectionInView && !this.isScrollLocked) {
    this.isScrollLocked = true;
    document.body.style.overflow = 'hidden';
  }

  if (this.isScrollLocked) {
    // Sensitivity (tweak for comfort)
    const scrollSpeed = 0.0015;
    const swipeSpeed = 0.002;

    // Vertical rotation (Y-axis)
    this.scrollProgress = Math.min(Math.max(this.scrollProgress + deltaY * scrollSpeed, 0), 1);

    // Horizontal rotation (X-axis)
    const rotationX = deltaX * swipeSpeed;

    // Apply combined rotation
    const rotationY = this.scrollProgress * 360;
    this.cylinderWrapper.nativeElement.style.transform =
      `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;

    // Unlock when done rotating
    if (this.scrollProgress === 1 || this.scrollProgress === 0) {
      this.isScrollLocked = false;
      document.body.style.overflow = '';

      const nextSection =
        this.scrollProgress === 1
          ? section.nextElementSibling
          : section.previousElementSibling;

      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}


  // @HostListener('wheel', ['$event'])
  // onWheel(event: WheelEvent) {
  //   const section = this.cylinderWrapper.nativeElement.parentElement!;
  //   const rect = section.getBoundingClientRect();

  //   // const sectionInView =
  //   //   rect.top <= window.innerHeight * 0.4 &&
  //   //   rect.bottom >= window.innerHeight * 0.4;

  //   // 🧮 Calculate centers
  //   const sectionCenter = rect.top + rect.height / 2;
  //   const viewportCenter = window.innerHeight / 2;

  //   // 🎯 Lock when centers align (within threshold)
  //   const threshold = 50; // px tolerance — adjust as needed
  //   const sectionInView = Math.abs(sectionCenter - viewportCenter) < threshold;

  //   // Only activate when section is centered
  //   if (sectionInView && !this.isScrollLocked) {
  //     this.isScrollLocked = true;
  //     document.body.style.overflow = 'hidden';
  //   }

  //   if (this.isScrollLocked) {
  //     event.preventDefault(); // stop actual page scroll
  //     const delta = event.deltaY * 0.0015; // scroll speed sensitivity
  //     this.scrollProgress = Math.min(Math.max(this.scrollProgress + delta, 0), 1);

  //     // update rotation based on scroll progress
  //     const rotationY = this.scrollProgress * 360;
  //     this.cylinderWrapper.nativeElement.style.transform = `rotateY(${-rotationY}deg)`;

  //     // unlock scroll once rotation done
  //     // if (this.scrollProgress === 1 || this.scrollProgress === 0) {
  //     //   this.isScrollLocked = false;
  //     //   document.body.style.overflow = '';
  //     // }

  //     if (this.scrollProgress === 1 || this.scrollProgress === 0) {
  //       this.isScrollLocked = false;
  //       document.body.style.overflow = '';

  //       // Determine scroll direction
  //       const nextSection =
  //         this.scrollProgress === 1
  //           ? section.nextElementSibling
  //           : section.previousElementSibling;

  //       if (nextSection) {
  //         const rect = nextSection.getBoundingClientRect();
  //         const targetY =
  //           window.scrollY +
  //           rect.top -
  //           window.innerHeight * 0.1; // adjust 0.1 for padding effect

  //         // ✅ Smoothly scroll in correct direction
  //         window.scrollTo({
  //           top: targetY,
  //           behavior: 'smooth',
  //         });
  //       }
  //     }
  //   }



  // }



}
