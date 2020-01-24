interface EventBody {
    uid ?:string;
    time ?:string | Date;
    ip ?:string;
    sdk_version ?:'1.0';
    app_name ?:string;
    duration ?:number;
    referer ?:string;
    event_page ?:string;
    event_flag :string;
    content ?:string;
}

class EventSender {
    constructor(public remoteUrl :string ,public userOptions :Partial<EventBody>) {
        const that = this;
        this.defaultOptions = {
            sdk_version: '1.0',
            get time(){ return new Date},
            get duration(){ return new Date().getTime() - that.startTime.getTime()},
        };
    }

    startTime :Date = new Date;
    content :{ [k:string]:any } = {};
    defaultOptions :Partial<EventBody>;

    setContent(content :{ [k:string]:any }) {
        Object.assign(this.content, content);
    }
    send(eventFlag :EventBody['event_flag'], content :{ [k:string]:any }) {
        const mergedContent = Object.assign({}, this.content, content);

        const body :EventBody = Object.assign({}, this.defaultOptions, this.userOptions, {
            content: JSON.stringify(mergedContent),
            event_flag: eventFlag,
        });

        this.sendRequest(body);
    }
    sendRequest(body :any) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.remoteUrl);
        xhr.onload = function() {
            if (['2', '3'].includes(xhr.status.toString()[0])) {
                const res = JSON.parse(xhr.responseText);
                if (res.errcode) {
                    console.error(`Error in point sent! Server response ${xhr.responseText}`);
                }
            } else {
                console.error(`Error in point sent! Server response HTTP code ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }
}
