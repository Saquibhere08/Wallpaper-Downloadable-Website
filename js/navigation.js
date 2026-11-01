const menuButton=document.querySelector('#menuButton');
const mainNav=document.querySelector('.main-nav');
if(menuButton&&mainNav){
  menuButton.addEventListener('click',()=>{
    const open=mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded',open);
    menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');
  });
  mainNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','Open menu');
  }));
}
