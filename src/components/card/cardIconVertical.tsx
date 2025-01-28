import React, { FC } from 'react';
import Link from "next/link";
import {Card} from "@/components/ui/card";

const CardIconVertical: FC<{
	title: string, number?: number, description?: string, route?: string,
	className?: string, animationDelay?: number, children: React.ReactNode}> = ({
	title, number, description, route, children, className, animationDelay=0,
}) => {
	return(
		<Link
			href={route ? route : "#"}>
			<Card className={`flex-col w-full h-full px-6 py-3 items-center text-center rounded-xl bg-muted/50 hover:cursor-pointer hover:bg-muted ${className}`}
						style={{animationDelay: `${animationDelay}s`}}>
				<div className={"flex justify-center"}>
					{
						number && number > 0 ?
							<div className={"font-semibold text-primary-foreground text-2xl bg-primary leading-[48px] size-[48px] rounded-full text-center"}>
								{number}
							</div>
						: children
					}

				</div>
				<div className={"text-xl font-bold space-x-2 mt-1"}>
					{title}
				</div>
				{description &&
					<div className={`text-sm text-muted-foreground pb-0`}>
						{description}
					</div>
				}
			</Card>
		</Link>
	);
};

export default CardIconVertical;