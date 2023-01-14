import classNames from 'classnames'
import React from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { getURL } from '../utils'
import CAccordion from './CAccordion'
import CButton from './CButton'

interface CHelpPageProps {}
const defaultProps: CHelpPageProps = {}

const CHelpPage: React.FC<CHelpPageProps> = ({}) => {
  const faqs = [
    {
      title: 'How purging works?',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    },
    {
      title: 'What is the limit of Free tier?',
      content:
        'In free tier you can enjoy all the pro feature at free. You can purge 5 videos in free tier. Also you can Channel purge alongside with single purge if you exceed 30 videos limitations.',
    },
    {
      title: 'How to switch to Pro plan from Enterprise plan?',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    },
    {
      title: 'What is the limit of Pro plan?',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    },
    {
      title: 'Can I export Purging History to .csv format?',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    },
    {
      title: 'Do you have refund policy?',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    },
    {
      title: 'Can I contact customer support if needed?',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    },
  ]

  return (
    <div>
      <div className="flex justify-between">
        <span className="font-bold text-title text-txt">FAQs</span>
      </div>

      {faqs.map((faq, index) => {
        const isLast = index == faqs.length
        return (
          <div className={classNames(isLast ? 'my-3' : 'mt-3')}>
            <CAccordion title={faq.title} content={faq.content} />
          </div>
        )
      })}

      <div
        className="flex flex-col items-center mb-1"
        style={{ marginTop: '26px' }}
      >
        <div
          className="font-semibold text-txt text-sm mb-3"
          style={{ lineHeight: '12px' }}
        >
          Do you still have any question?
        </div>
        <CButton
          buttonStyle="primary"
          icon={<img src={getURL('assets/icons/email.svg')} />}
          text="Contact Us"
          style={{
            width: '100px',
            borderRadius: '3px',
          }}
        />
      </div>
    </div>
  )
}

CHelpPage.defaultProps = defaultProps
export default CHelpPage
