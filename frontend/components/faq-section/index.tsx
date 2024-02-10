import React, { useState, useEffect } from 'react';
import Faq from '../home/faq';
import SectionTitle from '../home/sectionTitle';
const FaqSection: React.FC<{

}> = ({

}) => {

        return (
            <>
                <SectionTitle pretitle="FAQ" title="Frequently Asked Questions">
                    Welcome to our FAQ section! Here, we've compiled answers to some of the most common questions our customers ask.
                </SectionTitle>
                <Faq />
            </>
        );
    };

export default FaqSection;


