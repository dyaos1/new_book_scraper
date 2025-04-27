'use client'
import Paginator from '@/component/Paginator';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface User {
  id: string;
  name: string | null;
  email: string;
  isValid: boolean;
  isAdmin: boolean;
  createdAt: Date;
}

const ManagePage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [userCount, setUserCount] = useState(0)
  const [offset, setOffset] = useState(0)

  const [adminPromotors, setAdminPromotors] = useState<{[id:string]: boolean}>({})

  useEffect(() => {
    fetch(`/api/manage/user?offset=${offset}`, {
      method: 'GET',
    })
      .then(r => r.json())
      .then(r => {
        // eslint-disable-next-line
        setUsers(r.data.users.map((e: any) => {
          return {
            id: e.id,
            name: e.name,
            email: e.email,
            isValid: e.isValid,
            isAdmin: e.isAdmin,
            createdAt: e.createdAt,
          }
        }));
        console.log(r.data.count);
        setUserCount(r.data.count);
      })
  }, [offset])

  const confirmAdminPromotors = () => {
    console.log(adminPromotors);
    fetch(`/api/manage/user?type=ADMIN`, {
      method: "PUT",
      body: JSON.stringify({
        adminPromotors: adminPromotors,
      })
    })
      .then(r => {
        if (r.redirected) {
          window.location.href = r.url; // 클라이언트에서 명시적으로 이동시켜 줘야 함
        }
      })
  }
  
  return (
    <div>
      <div className={`flex flex-col w-full gap-4 mb-8`}>
        <div>
          <div className={`w-1/3 sm:w-1/4`}></div>
          <div className={`flex sm:hidden w-1/6`}></div>
          <div></div>
          <div></div>
        </div>
        {
          users.map((e: User, i) => {
            return (
              <UserDataRow 
                key={`userdatarow-${i}`} 
                id={e.id}
                email={e.email} 
                name={e.name || '-'} 
                isValid={e.isValid} 
                isAdmin={e.isAdmin}
                setAdminPromotor={setAdminPromotors}
              />
            )
          })
        }
      </div>
      <Paginator totalCount={userCount} setOffset={setOffset}/>
      <div className={`flex flex-row justify-between p-4`}>
        <div></div>
        <div>
          <button 
            className={`hover:cursor-pointer`}
            onClick={() => { confirmAdminPromotors() }}
          >Confirm</button>
        </div>
      </div>
    </div>
  )
}

interface UserDataRowProps {
  id: string
  email: string
  name: string
  isValid: boolean
  isAdmin: boolean
  setAdminPromotor: Dispatch<SetStateAction<{[id: string]: boolean}>>
}

const UserDataRow = ({
  id,
  email,
  name,
  isValid,
  isAdmin,
  setAdminPromotor,
}: UserDataRowProps) => {
  const [adminPromotedOrDepromoted, setAdminPromotedOrDepromoted] = useState(isAdmin)
  
  const promoteOrDepromoteAdmin = () => {
    const promotionResult = !adminPromotedOrDepromoted;
    setAdminPromotedOrDepromoted(promotionResult);
    setAdminPromotor(prev => {
      prev[id] = promotionResult;
      return prev;
    })
  }

  return (
    <div
      className={`flex flex-row w-full`}
    >
      <div className={`flex justify-center items-center w-1/2 sm:w-1/4`}>{email}</div>
      <div className={`hidden sm:flex justify-center items-center w-1/6`}>{name}</div>
      <div className={`flex justify-center items-center w-1/5`}>
        <div className={`w-4 h-4 rounded-full ${isValid ? 'bg-blue-500' : 'bg-red-500'}`}></div>
      </div>
      <div className={`flex justify-center items-center  w-1/5`}>
        <div 
          className={`w-4 h-4 rounded-full ${adminPromotedOrDepromoted ? 'bg-blue-500' : 'bg-red-500'} hover:cursor-pointer`}
          onClick={promoteOrDepromoteAdmin}
        ></div>
      </div>
    </div>
  )
}

export default ManagePage