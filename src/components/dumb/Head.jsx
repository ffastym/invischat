/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
/**
 * Head component
 *
 * @param url

 * @returns {*}
 * @constructor
 */
const Head = ({url}) => {
    let title = 'Invischat - Анонімний Чат | Форум',
        description = 'Анонімний чат з випадковим співрозмовником. Анонімний форум "Зізнання"',
        keywords = 'чат, анонімний чат, форум, lfyou, знайомства, чат знайомства в україні, знакомства, некто, чат онлайн, chat, шукаю тебе, анонімний чат тз, тз, шт, анонімний чат іф, зізнання, анонімний форум, anonumous chat, чат невидимки, Invischat, анонімний чат, типове зізнання, шукаю тебе';

    if (url === '/chat') {
        title = 'Анонімний Чат';
        keywords = 'чат, анонімний чат, lfyou, знайомства, чат знайомства в україні, знакомства, некто, чат онлайн, chat, шукаю тебе, анонімний чат тз, тз, шт, анонімний чат іф, зізнання, anonumous chat, чат невидимки, Invischat, анонімний чат, типове зізнання, шукаю тебе';
        description = 'Анонімний чат тет-а-тет з випадковим співрозмовником та загальна кімната знайомств". Invischat - знайомства, спілкування, кохання'
    } else if (url.indexOf('ziznannya') !== -1) {
        title = 'Анонімний Форум';
        description = 'Анонімний Форум - Зізнання, історії, думки, переживання. Відкрий душу, не втративши гідності';
        keywords = 'Анонімний форум, форум, зізнання, ТЗ, типове зізнання, признавашки, шукаю тебе, анонімні історії, розкажу по секрету, зізнання іф';
    }

    return (
        <React.Fragment>
            <title>{title}</title>
            <meta name='description' content={description}/>
            <meta name='keywords' content={keywords}/>
        </React.Fragment>
    )
};

export default Head
