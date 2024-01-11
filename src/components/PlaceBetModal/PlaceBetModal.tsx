'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { useGame, usePrepareBet, MarketOutcome } from '@azuro-org/sdk'
import { getMarketName } from '@azuro-org/dictionaries'
import { GameInfo } from '@/components'
import { AmountInput } from './AmountInput'
import { SubmitButton } from './SubmitButton'
import { Days_One } from 'next/font/google'


const daysone = Days_One({
  subsets: ['latin'],
  weight: '400'
});


type Props = {
  outcome: MarketOutcome
  closeModal: any
}

export function PlaceBetModal(props: Props) {
  const { outcome, closeModal } = props

  const params = useParams()
  const { data } = useGame({ gameId: params.id })
  const [ amount, setAmount ] = useState('')
  const [ isSuccess, setSuccess ] = useState(false)

  const {
    isOddsLoading,
    totalOdds,
    isAllowanceLoading,
    isApproveRequired,
    submit,
    approveTx,
    betTx,
  } = usePrepareBet({
    amount,
    slippage: 5,
    affiliate: '0x0000000000000000000000000000000000000000', // your affiliate address
    selections: [ outcome ],
    onSuccess: () => {
      setSuccess(true)
    },
  })

  const marketName = getMarketName({ outcomeId: String(outcome.outcomeId) })
  const isPending = approveTx.isPending || betTx.isPending
  const isProcessing = approveTx.isProcessing  || betTx.isProcessing

  return (
    <div
      className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-20"
      onClick={closeModal}
    >
      <div
        className="w-[480px] bg-zinc-700 max-h-[calc(100vh-40px)] overflow-y-auto no-scrollbar rounded-md shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {
          isSuccess ? (
            <div className="flex flex-col items-center justify-center h-[400px]" style={{borderRadius:'10px', border:'3px solid white'}}>
              <CheckBadgeIcon className="w-28 h-28 text-purple-500" />
              <div className={`mt-5 text-2xl font-semibold text-white ${daysone.className}`}>Success!</div>
            </div>
          ) : (
            <>
             
              <div className="pt-4 px-6 pb-6" style={{border:'3px solid gray'}}>
                <div className="grid grid-cols-[auto_1fr] gap-y-3 mt-2 text-md ">
                  <span className={`text-zinc-400 ${daysone.className}`}>Market</span>
                  <span className={`text-right font-semibold ${daysone.className} `}>{marketName}</span>
                  <span className={`text-zinc-400 ${daysone.className} `}>Selection</span>
                  <span className={`text-right font-semibold ${daysone.className} `}>{outcome.selectionName}</span>
                  <span className={`text-zinc-400 ${daysone.className} `}>Odds</span>
                  <span className={`text-right font-semibold ${daysone.className}  `}>
                    {isOddsLoading ? 'Loading...' : (
                      totalOdds !== undefined ? (
                        <>{(+totalOdds).toFixed(3)}</>
                      ) : (
                        <>-</>
                      )
                    )}
                  </span>
                </div>
                <AmountInput
                  amount={amount}
                  onChange={setAmount}
                />
                <SubmitButton
                  amount={amount}
                  isAllowanceLoading={isAllowanceLoading}
                  isApproveRequired={isApproveRequired}
                  isPending={isPending}
                  isProcessing={isProcessing}
                  onClick={submit}
                />
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}
