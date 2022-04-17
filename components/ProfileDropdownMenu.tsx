import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import UserInfoImage from './UserInfoImage'
import { ChevronDownIcon } from '@primer/octicons-react'
import LogoutContainer from './LogoutContainer'
import { Button } from './theme/Button'
import { UserInfo } from '../@types/user'
import { useUserInfoQuery } from '../graphql/index'
import { useRouter } from 'next/router'
import _ from 'lodash'
import styles from '../scss/profileDropDown.module.scss'

type ProfileDropDownMenuProps = {
  username: string
  isAdmin: boolean
}

type CustomToggleProps = {
  children?: React.ReactNode
  className?: string
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const ProfileDropdownMenu: React.FC<ProfileDropDownMenuProps> = ({
  username,
  isAdmin
}) => {
  const { data } = useUserInfoQuery({
    variables: { username },
    skip: !username
  })
  const router = useRouter()
  const location = router.asPath
  const PROFILE_PATH = '/profile/' + username

  const fullname = _.get(data, 'userInfo.user.name', '')

  const userInfo: UserInfo = {
    // 'A' stands for Anonymous, in case user did not put in full name
    username,
    firstName: fullname.split(' ')[0] || 'A',
    lastName: fullname.split(' ')[1] || ' ',
    discordUserId: _.get(data, 'userInfo.user.discordUserId', ''),
    discordUsername: _.get(data, 'userInfo.user.discordUsername', ''),
    discordAvatarUrl: _.get(data, 'userInfo.user.discordAvatarUrl', '')
  }

  const dropdownAdminMenuItems = [
    { title: 'Lessons', path: '/admin/lessons' },
    { title: 'Users', path: '/admin/users' },
    { title: 'Alerts', path: '/admin/alerts' }
  ]

  const isActive = (path: string) => {
    if (path === location) return `${styles['active']}`
    return ''
  }

  const adminDropdownMenu = dropdownAdminMenuItems.map(({ title, path }) => (
    <Dropdown.Item
      className={`${styles['dropdown-item']}`}
      href={path}
      key={title}
      bsPrefix={isActive(path)}
    >
      {title}
    </Dropdown.Item>
  ))

  const buttonMenuToggle = React.forwardRef(
    (props: CustomToggleProps, ref: React.Ref<HTMLDivElement>) => (
      <div ref={ref} {...props}>
        {props.children}
      </div>
    )
  )

  return (
    <Dropdown>
      <div className="d-none d-lg-block">
        <Dropdown.Toggle
          as={buttonMenuToggle}
          className={`${styles['nav-user-toggle']} `}
          id="user_nav_toggle"
        >
          <UserInfoImage user={userInfo} className={`${styles['user-icon']}`} />
          <span>{_.capitalize(username)}</span>
          <ChevronDownIcon size={16} />
        </Dropdown.Toggle>
        <Dropdown.Menu className={`${styles['dropdown-menu']}`} align="end">
          {isAdmin && (
            <>
              <Dropdown.Header>ADMIN</Dropdown.Header>
              {adminDropdownMenu}
              <Dropdown.Divider />
            </>
          )}
          <Dropdown.Item
            className={`${styles['dropdown-item']} `}
            bsPrefix={isActive(PROFILE_PATH)}
            href={PROFILE_PATH}
          >
            Profile
          </Dropdown.Item>
          <Dropdown.Item className={`${styles['dropdown-item']}`}>
            <LogoutContainer>Logout</LogoutContainer>
          </Dropdown.Item>
        </Dropdown.Menu>
      </div>
      <div className="d-lg-none">
        {adminDropdownMenu}
        <Dropdown.Item
          className={`${styles['dropdown-item']}`}
          bsPrefix={isActive(PROFILE_PATH)}
          href={PROFILE_PATH}
        >
          Profile
        </Dropdown.Item>
        <Dropdown.Item className={`${styles['dropdown-item']} `}>
          <LogoutContainer>
            <div className={`${styles['light-button']} d-inline`}>
              <Button border ml="2" type="light">
                Logout
              </Button>
            </div>
          </LogoutContainer>
        </Dropdown.Item>
      </div>
    </Dropdown>
  )
}

export default ProfileDropdownMenu
