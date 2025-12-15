import { useState } from "react";

export default function Review(){
    
    const [reviewValue, setReviewValue] = useState<string>('');
    
    return(
        <div>
            <textarea name='review' id='review' rows={10} cols={50} value={reviewValue} onChange={handleInput} ></textarea>
            <button type='button'></button>
        </div>
    );

    function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>){
        setReviewValue(event.target.value);
    }
}