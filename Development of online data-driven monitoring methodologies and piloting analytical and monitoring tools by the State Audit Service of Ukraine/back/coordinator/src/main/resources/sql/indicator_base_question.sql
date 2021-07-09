UPDATE indicator SET base_question = 'Чи вірно спрацював алгоритм індикатора?';

UPDATE indicator SET algorithm_description = 'Індикатор відображає позитивне значення у випадку коли замовник розпочав переговорну процедуру по причині "двічі відмінені торги через відсутність достатньої кількості учасників", але в періоді одного року в системі відсутні дві процедури відмінених торгів з аналогічним предметом закупівлі.'
WHERE code = 'RISK1-1';

UPDATE indicator SET algorithm_description = 'Індикатор відображає позитивне значення у випадку коли очікувана вартість процедури перевищує еквівалент 133 тис. євро по курсу НБУ на дату оголошення.'
WHERE code = 'RISK1-2_1';

UPDATE indicator SET algorithm_description = 'Індикатор відображає позитивне значення у випадку коли очікувана вартість процедури перевищує еквівалент 5150 тис. євро по курсу НБУ на дату оголошення.'
WHERE code = 'RISK1-2_2';

UPDATE indicator SET algorithm_description = 'Індикатор відображає позитивне значення у випадку коли відсутній електронний підпис замовника у тендерній документації.'
WHERE code = 'RISK1-3_1';

UPDATE indicator SET algorithm_description = 'Індикатор відображає позитивне значення у випадку коли відсутній електронний підпис замовника у документах визначення переможця.'
WHERE code = 'RISK1-3_2';

UPDATE indicator SET algorithm_description = 'Індикатор відображає позитивне значення у випадку коли відсутній електронний підпис замовника у документах публікації договору.'
WHERE code = 'RISK1-3_3';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора аналізує факт розміщення файлу документа протягом 5 робочих днів від початку визначення переможця, якщо замовник не приєднав документ та не розмістив протокол про продовження терміну розгляду учасника протягом 5 робочих днів від початку визначення переможця, то індикатор покаже позитивне значення.'
WHERE code = 'RISK1-4_1';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, замовник розмістив файл документу або протокол про продовження терміну розгляду учасника, але протягом 20 робочих днів від початку визначення переможця не визнав переможною/відхилив пропозицію.'
WHERE code = 'RISK1-4_2';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, розмір гарантійного забезпечення перевищує 3% від очікуваної вартості процедури.'
WHERE code = 'RISK1-5_1';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, розмір гарантійного забезпечення перевищує 0,5% від очікуваної вартості процедури.'
WHERE code = 'RISK1-5_2';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, в завершеній процедурі в розділі публікації документів договору є лише електронний підпис, та відсутній будь який прикріплений файл документу включаючи опублікований договір.'
WHERE code = 'RISK1-6';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, у розділі публікації документів договору замовник розмістив будь який файли раніше, ніж за 10 днів від дати публікації наміру про укладення договору.'
WHERE code = 'RISK1-8_1';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, у розділі публікації документів договору замовник не розмістив файли протягом 22 днів після публікації наміру про укладення договору.'
WHERE code = 'RISK1-8_2';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, очікувана вартість звіту перевищує 200 тис. грн. (якщо звіт публікує загальний замовник) або 1 млн. грн. (якщо звіт публікує замовник, що діє в окремих сферах господарювання).'
WHERE code = 'RISK1-10_1';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, очікувана вартість звіту перевищує 1,5 млн. грн. (якщо звіт публікує загальний замовник) або 5 млн. грн. (якщо звіт публікує замовник, що діє в окремих сферах господарювання).'
WHERE code = 'RISK1-10_2';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, очікувана вартість допорогової закупівлі перевищує 200 тис. грн. (якщо закупівлю оголошує загальний замовник) або 1 млн. грн. (якщо закупівлю оголошує замовник, що діє в окремих сферах господарювання).'
WHERE code = 'RISK1-10_3';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, очікувана вартість допорогової закупівлі перевищує 1,5 млн. грн. (якщо закупівлю оголошує загальний замовник) або 5 млн. грн. (якщо закупівлю оголошує замовник, що діє в окремих сферах господарювання).'
WHERE code = 'RISK1-10_4';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, замовник опублікував відповідь на звернення пізніше, ніж 4 робочі дні, або не опублікував зовсім.'
WHERE code = 'RISK1-12';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, тендерна документація у процедурі закупівлі відсутня.'
WHERE code = 'RISK1-13_1';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, замовник порушив термін публікації тендерної документації в процедурі закупівлі: від дня публікації останнього документу до  завершення подачі пропозицій залишилося менше 15 днів.'
WHERE code = 'RISK1-13_2';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, замовник оприлюднює тендерну документацію менше ніж за 30 днів до встановленого в оголошенні кінцевого строку подання тендерних пропозицій.'
WHERE code = 'RISK1-13_3';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли,  у тендерній пропозиції переможця відсутні будь які файлові документи.'
WHERE code = 'RISK1-14';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, сума очікуваної вартості цієї допорогової закупівлі разом з попередніми звітами та допорогами замовника за аналогічним предметом закупівлі у поточному році перевищують 200 тис. грн. (для загальних замовників) або 1 млн. грн. (для замовників, що діють в окремих сферах господарювання).'
WHERE code = 'RISK2-5П';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, допорогова закупівля має вартість від 190 000 грн. до 199 999,99 грн. (для загальних замовників) або від 900 000 грн. до 999 999,99 грн. (для замовників, що діють в окремих сферах господарювання), та протягом поточного року замовник вже уклав договір на подібну суму (звіт, допорогова закупівля) з тим самим постачальником.'
WHERE code = 'RISK2-5_1П';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, сума очікуваної вартості цього звіту разом з попередніми звітами та допорогами замовника за аналогічним предметом закупівлі у поточному році перевищують 200 тис. грн. (для загальних замовників) або 1 млн. грн. (для замовників, що діють в окремих сферах господарювання).'
WHERE code = 'RISK2-5_2П';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, звіт має вартість від 190 000 грн. до 199 999,99 грн. (для загальних замовників) або від 900 000 грн. до 999 999,99 грн.  (для замовників, що діють в окремих сферах господарювання), та протягом поточного року замовник вже уклав договір на подібну суму (звіт, допорогова закупівля) з тим самим постачальником.'
WHERE code = 'RISK2-5_3П';

UPDATE indicator SET algorithm_description = 'Очікувана вартість даної допорогової закупівлі разом з попередніми звітами та дорогами даного замовника за даним предметом закупівлі у поточному році перевищують 1,5 млн. грн. (для загальних замовників) або 5 млн. грн. (для замовників, що діють в окремих сферах господарювання).'
WHERE code = 'RISK2-6П';

UPDATE indicator SET algorithm_description = 'Проведена допорогова закупівля має вартість від 1 350 000 грн. до 1 499 999,99 грн. (для загальних замовників) або від 4 500 000 грн. до 4 999 999,99 грн. (для замовників, що діють в окремих сферах господарювання)? Чи мав замовник протягом поточного року договір на подібну суму (звіт, допорогова закупівля) з тим самим постачальником.'
WHERE code = 'RISK2-6_1П';

UPDATE indicator SET algorithm_description = 'Очікувана вартість даного звіту разом з попередніми звітами та допорогами даного замовника за даним предметом закупівлі у поточному році перевищують 1,5 млн. грн. (для загальних замовників) або 5 млн. грн. (для замовників, що діють в окремих сферах господарювання).'
WHERE code = 'RISK2-6_2П';

UPDATE indicator SET algorithm_description = 'Опублікований звіт має вартість від 1 350 000 грн. до 1 499 999,99 грн. (для загальних замовників) або від 4 500 000 грн. до 4 999 999,99 грн. (для замовників, що діють в окремих сферах господарювання)? Чи мав замовник протягом поточного року договір на подібну суму (звіт, допорогова закупівля) з тим самим постачальником.'
WHERE code = 'RISK2-6_3П';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, замовник відхилив усі тендерні пропозиції, крім переможця, ціна якого є найбільш економічно невигідною.'
WHERE code = 'RISK2-13';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, замовник відхилив усі тендерні пропозиції, крім переможця, ціна якого є найбільш економічно невигідною.'
WHERE code = 'RISK2-13-1';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, замовником було відхилено 2 чи більше тендерні пропозиції на стадії прекваліфікації.'
WHERE code = 'RISK2-14';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, замовником було відхилено 2 чи більше тендерні пропозиції на стадії прекваліфікації.'
WHERE code = 'RISK2-14_1';

UPDATE indicator SET algorithm_description = 'Алгоритм індикатора відображає позитивне значення коли, у процедурі були дискваліфікації та визнано переможцем ФОП, що має попередні договори з замовником по 3-х чи більше предметах закупівель.'
WHERE code = 'RISK2-17_2п';

UPDATE indicator SET algorithm_description = 'Перевіряє, чи існують 2 неуспішні процедури/лоти з тим самим предметом закупівлі протягом року від початку переговорної процедури.Також перевіряє, чи не проводив замовник переговорну процедуру за цим предметом закупівлі після 2-х неуспішних.' where code = 'RISK-1-1';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи існує попередня процедура, чи вона конкурентна, чи той самий там постачальник, чи є там предмети закупівлі, що докупаються за допомогою переговорної процедури.' where code = 'RISK-1-2';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи існує попередня процедура, чи вона конкурентна, чи той самий там постачальник, чи є там предмети закупівлі, що докупаються за допомогою переговорної процедури.' where code = 'RISK-1-2-1';
UPDATE indicator SET algorithm_description = 'Вибрана причина проведення переговорної процедури не відповідає детальному опису вибору причини проведення переговорної процедури' where code = 'RISK-1-3';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи перевищує очікувана вартість 133 тис. євро.' where code = 'RISK-1-4';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи перевищує очікувана вартість 5,05 млн. євро.' where code = 'RISK-1-4-1';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи було опубліковано договір протягом 7 робочих днів' where code = 'RISK-1-5';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи пройшло 3 дні від дати підписання додаткової угоди до дати її оприлюднення.' where code = 'RISK-1-6';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи пройшло 5 робочих днів на розгляд та 1 календарний день на оприлюднення визначення переможця у відкритих торгах (без протоколу про продовження строку розгляду)' where code = 'RISK-1-7';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи пройшло 20 робочих днів на розгляд та 1 календарний день на оприлюднення визначення переможця у відкритих торгах (з протоколом про продовження строку розгляду)' where code = 'RISK-1-7-1';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи не перевищено розмір тендерного забеспечення у 3% від очікуваної вартості.' where code = 'RISK-1-8';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи не перевищено розмір тендерного забеспечення у 0,5% від очікуваної вартості.' where code = 'RISK-1-8-1';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи перевищено поріг у 200 тис. грн. при оголошенні спрощеної закупівлі' where code = 'RISK-1-9';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи перевищено поріг у 200 тис. грн. (1 млн. для замовників в окремих сферах) при оголошенні спрощеної закупівлі' where code = 'RISK-1-9-1';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи перевищено поріг у 1,5 млн. грн. (5 млн. для замовників в окремих сферах) при оголошенні спрощеної закупівлі' where code = 'RISK-1-10';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи надана відповідь на звернення протягом 3-х робочих днів.' where code = 'RISK-1-11';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи пройшло 20 робочих днів на розгляд та 1 календарний день на оприлюднення визначення переможця у відкритих торгах з публікацією англійською мовою' where code = 'RISK-1-12';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи знаходиться скарга у статусі "Задоволена" після 30 днів з момента публікації рішення органу оскарження.' where code = 'RISK-1-13';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи опублікований звіт про виконання договору після дати, що вказана замовником, як дата завершення договору' where code = 'RISK-1-14';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи є у завершеній процедурі документи договора, а не лише електронний підпис.' where code = 'RISK-1-15';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи опублікований договір у процедурі відкритих торгів через 20 робочих днів (на підписання) та 3 календарних днів (на публікацію) з дати публікації наміру про підписання договору ' where code = 'RISK-1-16';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи опублікований договір у прискореній переговорній процедурі через 20 робочих днів (на підписання) та 3 календарних днів (на публікацію) з дати публікації наміру про підписання договору ' where code = 'RISK-1-17';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи опублікований договір у переговорній процедурі через 35 робочих днів (на підписання) та 3 календарних днів (на публікацію) з дати публікації наміру про підписання договору ' where code = 'RISK-1-18';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи не перевищує очікувана вартість 50 тис. грн. у звіті про укладений договір.' where code = 'RISK-1-19';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи була присутня тендерна документація на момент визначення переможця.' where code = 'RISK-1-20';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи  замовником було опубліковано тендерну документацію пізніше ніж за 15 днів до дати розкриття тендерних пропозицій у процедурі відкритих торгів.' where code = 'RISK-1-21';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи  замовником було опубліковано тендерну документацію пізніше ніж за 30 днів до дати розкриття тендерних пропозицій у процедурі відкритих торгів з публікацією англійською мовою.' where code = 'RISK-1-21-1';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи замовником обрано переможцем процедури закупівлі учасника, яким у складі тендерної пропозиції не подано жодного документа' where code = 'RISK-2-3';
UPDATE indicator SET algorithm_description = 'Індикатор виявляє ситуації, коли замовник дискваліфікував усіх учасників лота або процедури (якщо вона однолотова), окрім переможця.' where code = 'RISK-2-4';
UPDATE indicator SET algorithm_description = 'Індикатор виявляє ситуації, коли замовник дискваліфікував усіх учасників лота або процедури (якщо вона однолотова), окрім переможця.' where code = 'RISK-2-4-1';
UPDATE indicator SET algorithm_description = 'Даний індикатор виявляє ситуації, коли замовник проводить допорогову закупівлю товарів чи послуг за одним кодом CPV протягом календарного року, що в сумі складає 200 тис. грн.' where code = 'RISK-2-5';
UPDATE indicator SET algorithm_description = 'Даний індикатор виявляє ситуації, коли замовник в окремих сферах проводить допорогову закупівлю товарів чи послуг за одним кодом CPV протягом календарного року, що в сумі складає 1 млн. грн.' where code = 'RISK-2-5-1';
UPDATE indicator SET algorithm_description = 'Даний індикатор виявляє ситуації, коли замовник проводить допорогову закупівлю робіт за одним кодом CPV протягом календарного року, що в сумі складає 1,5 млн. грн.' where code = 'RISK-2-6';
UPDATE indicator SET algorithm_description = 'Даний індикатор виявляє ситуації, коли замовник в окремих сферах проводить допорогову закупівлю робіт за одним кодом CPV протягом календарного року, що в сумі складає 5 млн. грн.' where code = 'RISK-2-6-1';
UPDATE indicator SET algorithm_description = 'Замовник проводить не першу допорогову закупівлю у одного постачальника товарів чи послуг з сумою, що дуже близька до порогу 200000 грн. Індикатор спрацьовує, якщо протягом календарного року Замовник вже проводив закупівлі, що близькі до порогу.' where code = 'RISK-2-7';
UPDATE indicator SET algorithm_description = 'Замовник в окремих сферах проводить не першу допорогову закупівлю у одного постачальника товарів чи послуг з сумою, що дуже близька до порогу 1 млн. грн. Індикатор спрацьовує, якщо протягом календарного року Замовник вже проводив закупівлі, що близькі до порогу.' where code = 'RISK-2-7-1';
UPDATE indicator SET algorithm_description = 'Замовник проводить не першу допорогову закупівлю у одного постачальника робіт з сумою, що дуже близька до порогу 1,5 млн. грн. Індикатор спрацьовує, якщо протягом календарного року Замовник вже проводив закупівлі, що близькі до порогу.' where code = 'RISK-2-8';
UPDATE indicator SET algorithm_description = 'Замовник в окремих сферах проводить не першу допорогову закупівлю у одного постачальника робіт з сумою, що дуже близька до порогу 5 млн. грн. Індикатор спрацьовує, якщо протягом календарного року Замовник вже проводив закупівлі, що близькі до порогу.' where code = 'RISK-2-8-1';
UPDATE indicator SET algorithm_description = 'Замовник відхиляє найбільш економічно вигідну тендерну пропозицію учасника та визначає переможцем ФОП, з яким замовник вже має 2 контракти.' where code = 'RISK-2-9';
UPDATE indicator SET algorithm_description = 'Виявляє ситуації, коли замовник дискваліфікував двох або більше Учасників при проведенні предкваліфікації у процедурі відкритих торгів з публікацією англійською мовою.' where code = 'RISK-2-10';
UPDATE indicator SET algorithm_description = 'Виявляє ситуації, коли замовник дискваліфікував двох або більше Учасників при проведенні предкваліфікації у процедурі відкритих торгів з публікацією англійською мовою.' where code = 'RISK-2-10-1';
UPDATE indicator SET algorithm_description = 'Замовник відмінив процедуру за відсутністю подальшої потреби, але в межах календарного оголосив процедуру за таким самим предметом закупівлі' where code = 'RISK-2-11';
UPDATE indicator SET algorithm_description = 'Замовник відмінив процедуру за причини скорочення фінансування, але потім протягом 30 календарних днів оголосив процедуру за таким самим предметом закупівлі.' where code = 'RISK-2-12';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи змінювали ціну предмету закупівлі у договорі частіше ніж один раз у 90 днів' where code = 'RISK-2-14';
UPDATE indicator SET algorithm_description = 'Даний індикатор виявляє ситуації, коли замовник проводить закупівлі у одного постачальника за 4 або більше різним кодам предметів закупівлі.' where code = 'RISK-2-15';
UPDATE indicator SET algorithm_description = 'Даний індикатор виявляє ситуації, коли замовник проводить закупівлі у одного постачальника за 4 або більше різним кодам предметів закупівлі.' where code = 'RISK-2-15-1';
UPDATE indicator SET algorithm_description = 'Перевіряє, чи було скасовано рішення про вибір переможця без наявності скарг у процедурі.' where code = 'RISK-2-16';
UPDATE indicator SET algorithm_description = 'Виявляє ситуації, коли замовник відхиляє три або більше тендерних пропозиції, які за результатами оцінки визначені найбільш економічно вигідними.' where code = 'RISK-2-19';
UPDATE indicator SET algorithm_description = 'Виявляє ситуації, коли замовник відхиляє дві тендерні пропозиції, які за результатами оцінки визначені найбільш економічно вигідними.' where code = 'RISK-2-19-1';