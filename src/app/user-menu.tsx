import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { auth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logout } from './logout';


export async function UserMenu() {
  const user = await auth();

  if (!user) {
    return (
      <Button asChild variant="outline">
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="icon" className='size-10 rounded-full font-bold'>{user.email[0]?.toUpperCase()}</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className='w-56' side='bottom' align='end' >
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem asChild><Logout/></DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

}
