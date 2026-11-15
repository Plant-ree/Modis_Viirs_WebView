
const btn = document.getElementById('toggleFooterBtn');
const footer = document.getElementById('slideUpFooter');

btn.addEventListener('click', () => {
            footer.classList.toggle('active');
            btn.classList.toggle('active');
            
            if (footer.classList.contains('active')) {
                btn.textContent = 'Close Fire Info.';
            } else {
                btn.textContent = 'Open Fire Info.';
            }
        });


const url = new URL(window.location);
url.search = '';
window.history.replaceState({}, '', url);
window.location.hash = "";

const list = document.querySelector('.item-list');
list.addEventListener('click', (event) => {
    const clickedItem = event.target.closest('.item');
    
    if (clickedItem) {
        const allItems = list.querySelectorAll('.item');
        allItems.forEach(item => item.classList.remove('selected'));
        clickedItem.classList.add('selected');

        window.location.hash = "itemId=" + clickedItem.id;
    }
});


