import '../Routes.css';

function MainModal({ active, setActive }) {

  return (  
    <div className={active ? 'main_modal active' : 'main_modal'} onClick={() => setActive(false)}>
      <form id='create-new-message' onClick={e => e.stopPropagation()}>
        <div className='form_header'>
            <span className='cross_icon' onClick={() => setActive(false)} />
        </div>
        <h3>Создать запись</h3>
        <input placeholder='Название' />
        <input placeholder='Категория' />
        <input placeholder='Дата' />
        <input placeholder='Время' />
        <input placeholder='Комментарий' />

        <button id='create-new-message-button'>Создать запись</button>
      </form>
    </div>
  );
}

export default MainModal;
