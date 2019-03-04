import React, {Component} from 'react'
import socket from '../../socket'

/**
 * Contact us component
 */
class ContactUs extends Component {
    state = {
        isEmptyText: false,
        mailSendSuccess: false,
        mailSendError: false,
        emailWasSend: false
    };

    /**
     * ComponentDidMount method
     */
    componentDidMount() {
        socket.chat.off('email send error').on('email sending error', () => {
            this.setState({
                mailSendError: true
            })
        });

        socket.chat.off('email send successfully').on('email send successfully', () => {
            this.setState({
                mailSendSuccess: true
            })
        });

        window.addEventListener('resize', this.scrollBottom)
    }

    scrollBottom = () => {
        this.pageRef.scrollTop = this.pageRef.scrollHeight
    };

    /**
     * Get message field ref
     *
     * @param node
     */
    getTextareaRef = (node) => {
        this.textArea = node;
    };

    /**
     * Send mail method
     */
    sendMail = () => {
        let message = this.textArea.value;

        if (message) {
            socket.chat.emit('send mail', message);
            this.setState({
                emailWasSend: true,
                isEmptyText: false
            });
        } else {
            this.setState({
                isEmptyText: true
            });
        }
    };

    getPageRef = (node) => {
        this.pageRef = node;
    };

    /**
     * Render component method
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="page-content" ref={this.getPageRef}>
                <h2 className='page-title'>Зв'язок із Нами</h2>
                {this.state.emailWasSend ? this.state.mailSendSuccess ?
                    <p>Лист успішно відправлено. Дякуємо за Ваш відгук!</p> :
                    this.state.mailSendError ?
                        <p>При відправленні листа сталася помилка. Будь ласка, спробуйте пізніше</p> :
                        <div className="send-mail-loader">
                            <span className="sending-process-message">Надсилаємо повідомлення...</span>
                            <span className="loader"/>
                        </div> :
                    <div>
                        <p className='page-description'>
                            Якщо ви помітили помилки в роботі сервісу можете повідомити нам деталі, щоб ми могли швидко їх
                            їх усунути. <br/> Також у цій формі можна написати свої пропозиції щодо вдосконалення сервісу.
                            Ми розглянемо усі варіанти. Можливо, саме Ваша ідея стане ключовою у розвитку ресурсу =)
                        </p>
                        {this.state.isEmptyText ? <p className="error">Повідомлення не може бути пустим</p> : false}
                        <textarea className="mail-text"
                                  placeholder="Введіть повідомлення..."
                                  autoFocus={true}
                                  ref={this.getTextareaRef}
                        />
                        <div className="actions buttons">
                            <button className="button ok-button" onClick={this.sendMail}>Надіслати</button>
                        </div>
                    </div>}
            </div>
        )
    }
}

export default ContactUs
