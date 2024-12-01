import { useState } from 'react';
import './Routes.css';

import MainModal from './RouteModals/MainModal';

function Main() {

  const [active, setActive] = useState(false);

  return (  
    <main className='app_main'>
      <ul className='app_main_sub_header'>
        <li className='sub_header_item'>
          <p>Сумма</p>
          <span className='filter_icon' />
        </li>
        <li className='sub_header_item'>
          <p>Тип</p>
          <span className='filter_icon' />
        </li>
        <li className='sub_header_item'>
          <p>Период</p>
          <span className='filter_icon' />
        </li>
        <li className='sub_header_item'>
          <p>Дата</p>
          <span className='filter_icon' />
        </li>
      </ul>

      <div className='app_main_content'>
        <h2>Сегодня</h2>

        <ul className='history_list'>
          <li className='history_list_item'>
            <div className='history_list_item_main'>
              <div className='history_item_content'>
                <p>#2 Еда</p>
                <h3>Вкусно и точка</h3>
                <p>15:12</p>
                <p>2024/04/08</p>
              </div>
              <div className='total_container'>
                <span className='total'>1544,44</span>
                <span className='ruble'>₽</span>
              </div>
            </div>
            <div className='history_list_item_comments'>
              <div className='history_list_item_comments_header'>
                <p className='history_item_title'>Коментарий</p>
              </div>
              <span className='history_item_comment'>Ебать поел</span>
            </div>
          </li>

          <li className='history_list_item'>
            <div className='history_list_item_main'>
              <div className='history_item_content'>
                <p>#1 Новые средства</p>
                <h3>Зарплата</h3>
                <p>5:12</p>
                <p>2024/04/08</p>
              </div>
              <div className='total_container'>
                <span className='total plus'>+20000</span>
                <span className='ruble plus'>₽</span>
              </div>
            </div>
            <div className='history_list_item_comments'>
              <div className='history_list_item_comments_header'>
                <p className='history_item_title'>Коментарий</p>
              </div>
              <span className='history_item_comment'>Ура наконец-то</span>
            </div>
          </li>
        </ul>
      </div>
      
      <button className='create_new' onClick={() => setActive(true)} />

      <MainModal
        active={active}
        setActive={setActive}
      />
    </main>
  );
}

export default Main;
