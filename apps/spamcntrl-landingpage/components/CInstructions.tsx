import React from 'react'
import Head from 'next/head'
import classNames from 'classnames'
import CInstructionBox, { CInstructionBoxProps } from './CInstructionBox'

export interface CInstructionsProps {
  instructions?: CInstructionBoxProps[]
}
const defaultProps: CInstructionsProps = {
  instructions: [
    {
      title: 'Link YouTube Account',
      image: '/images/link-youtube-account.png',
      description: 'Login with your google account.',
    },
    {
      title: 'Scan Comments',
      image: '/images/scan-comments.png',
      description:
        'With the help of our dynamic algorithm, we are able to detect all types of spam on a youtube channel.',
    },
    {
      title: 'Delete Spam Comments',
      image: '/images/delete-spam-comments.png',
      description:
        'Once the spam is detected, we can automatically delete the spam.',
    },
  ],
}

const CInstructions: React.FC<CInstructionsProps> = ({ instructions }) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(0)
  const [touchStart, setTouchStart] = React.useState(0)
  const [touchEnd, setTouchEnd] = React.useState(0)

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setTouchStart(e.targetTouches[0].clientX)
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  function handleTouchEnd() {
    if (touchStart - touchEnd > 150) {
      // do your stuff here for left swipe
      moveSliderRight()
    }

    if (touchStart - touchEnd < -150) {
      // do your stuff here for right swipe
      moveSliderLeft()
    }
  }

  function moveSliderRight() {
    if (instructions && instructions.length > 0) {
      setActiveIndex(
        activeIndex == instructions.length - 1
          ? instructions.length - 1
          : activeIndex + 1
      )
    }
  }

  function moveSliderLeft() {
    if (instructions && instructions.length > 0) {
      setActiveIndex(activeIndex == 0 ? 0 : activeIndex - 1)
    }
  }

  const activeInstruction =
    instructions && instructions.length > 0
      ? instructions.find((_, index) => {
          return index == activeIndex
        })
      : null

  return (
    <>
      <div
        className={classNames(
          'justify-center px-8 mt-8 hidden space-x-8',
          'xl:px-[103px] xl:mt-[80px] xl:flex'
        )}
      >
        {instructions &&
          instructions.map((instruction) => {
            return (
              <CInstructionBox
                key={instruction.title}
                title={instruction.title}
                image={instruction.image}
                description={instruction.description}
              />
            )
          })}
      </div>

      <div className={classNames('block', 'xl:hidden')}>
        <div className={classNames('justify-center px-8 mt-8 flex')}>
          {activeInstruction && (
            <CInstructionBox
              key={activeInstruction?.title}
              title={activeInstruction.title}
              description={activeInstruction?.description}
              image={activeInstruction?.image}
              onTouchMove={handleTouchMove}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />
          )}
        </div>
        <div className="flex justify-center">
          <div className="mt-10 space-x-[20px]">
            {instructions &&
              instructions.map((instruction, index) => {
                const active = index == activeIndex
                return (
                  <span
                    key={instruction.title}
                    className={classNames(
                      'rounded-little bg-[#33C286] inline-block',
                      active
                        ? 'w-[30px] h-[10px]'
                        : 'w-[10px] h-[10px] bg-opacity-20 cursor-pointer'
                    )}
                    onClick={() => {
                      setActiveIndex(index)
                    }}
                  ></span>
                )
              })}
          </div>
        </div>
      </div>
    </>
  )
}

CInstructions.defaultProps = defaultProps
export default CInstructions
