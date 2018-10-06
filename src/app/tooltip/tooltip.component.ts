import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  @Input()text: string;
  private element: any;
  private button: any;
  private tip: any;

  constructor(private elem: ElementRef) {
    this.element = elem.nativeElement; 
  }

  ngOnInit() {
   this.initialize();
  }

  initialize() {
    this.tip = this.element.querySelector('.ngtooltip');
    this.button = this.element.querySelector('button');
    $(this.button).bind('focus', (e: any) => {
      showNode();
    });
    $(this.button).bind('blur', (e: any) => {
      removeNode();
    });
    
    let showNode = () => { 
      if(this.text === '') return;
      let _div = document.createElement('div');
      _div.className = 'ngtooltip';
      _div.innerHTML = `<span>${this.text}</span>`;
      document.body.appendChild(this.tip); 
      position();
      $(this.tip).addClass('active');
    }

    let removeNode = () => {
      $(this.tip).removeClass('active');
      this.element.appendChild(this.tip);
    } 

    let position = () => { 
      let pos = $(this.button).position();
      $(this.tip).attr('style',`top: ${pos.top-$(this.tip).height()}px;left:${Math.abs(pos.left - $(this.tip).width() / 2 ) + $(this.button).width() / 2}px;`);
    }

    let keyboard = () => {
      $(document).keyup((e: any) => {
        removeNode();
        $(this.button).blur();
      });
      $(document).scroll((e: any) => {
        if($(this.tip).hasClass('active')) {
          let top = Math.round(($(this.button).offset().top - $(this.tip).height()) - $(e.target).scrollTop());
          let calculatTop = $(this.button).position().top - ($(this.tip).height());
          let buttonTopPosition = Math.round(($(this.button).position().top+this.button.offsetHeight)-$(e.target).scrollTop());
          if(top < 0 && buttonTopPosition > 0) {
            this.tip.style.top =  + Math.abs(($(this.button).position().top + $(this.tip).height()) - ( $(e.target).scrollTop()))+'px';
            this.tip.style.position = 'fixed';
            $('span',this.tip).addClass('bottom');
          } else if (buttonTopPosition <= 0) {
            this.tip.style.top = 0;
            this.tip.style.position = 'fixed';
            $('span',this.tip).addClass('bottom');
          }
          else {
            $('span',this.tip).removeClass('bottom');
            this.tip.style.top = calculatTop+'px';
            this.tip.style.position = 'absolute';
          }
        }
      });
    }
    keyboard();
  }
}
